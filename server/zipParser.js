/**
 * zipParser.js
 * In-memory codebase ZIP archive analyzer and AST structural parser
 * Extracts dependency manifests, routes, DB schemas, language stats, and file hierarchy
 */

const AdmZip = require('adm-zip');
const path = require('path');

// Ignore non-source or high-noise directories
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.github',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '__pycache__',
  '.pytest_cache',
  '.venv',
  'venv',
  'env',
  '.idea',
  '.vscode',
  'coverage',
  '.turbo'
]);

// Source code file extensions of interest
const CODE_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java',
  '.cpp', '.c', '.h', '.sql', '.prisma', '.proto', '.yaml', '.yml',
  '.json', '.toml', '.env.example', '.dockerfile', '.sh', '.txt',
  '.lock', '.mod', '.gradle', '.cfg', '.ini'
]);

/**
 * Parses a ZIP buffer and produces an architectural codebase manifest
 * @param {Buffer|string} zipInput Buffer or base64 encoded string of zip archive
 * @param {string} [archiveName] Optional filename
 */
function parseCodebaseZip(zipInput, archiveName = 'codebase.zip') {
  let zipBuffer;
  if (typeof zipInput === 'string') {
    // Strip possible data URI header e.g. "data:application/zip;base64,"
    const base64Data = zipInput.replace(/^data:[^;]+;base64,/, '');
    zipBuffer = Buffer.from(base64Data, 'base64');
  } else {
    zipBuffer = zipInput;
  }

  const zip = new AdmZip(zipBuffer);
  const zipEntries = zip.getEntries();

  const manifest = {
    archiveName: archiveName.replace(/\.[^/.]+$/, ''),
    totalFiles: 0,
    totalLinesOfCode: 0,
    languages: {},
    detectedStack: new Set(),
    routes: [],
    models: [],
    dependencies: [],
    dockerServices: [],
    fileTree: [],
    representativeCode: []
  };

  const fileMap = new Map();

  // 1. Scan entries and filter ignored paths
  for (const entry of zipEntries) {
    if (entry.isDirectory) continue;

    const entryPath = entry.entryName.replace(/\\/g, '/');
    const pathParts = entryPath.split('/');

    // Check if path contains ignored folder
    if (pathParts.some(p => IGNORED_DIRS.has(p.toLowerCase()))) {
      continue;
    }

    const ext = path.extname(entryPath).toLowerCase();
    const fileName = path.basename(entryPath);

    // Filter by relevant code/config extensions or specific config filenames
    const isSpecialFile = fileName.toLowerCase().includes('dockerfile') || fileName === 'Makefile';
    if (!CODE_EXTENSIONS.has(ext) && !isSpecialFile) {
      continue;
    }

    manifest.totalFiles++;

    // Read content text safely
    let textContent = '';
    try {
      textContent = entry.getData().toString('utf8');
    } catch (e) {
      continue;
    }

    const lineCount = textContent.split('\n').length;
    manifest.totalLinesOfCode += lineCount;

    // Language aggregation
    const lang = detectLanguage(ext, fileName);
    if (lang) {
      manifest.languages[lang] = (manifest.languages[lang] || 0) + lineCount;
    }

    fileMap.set(entryPath, {
      name: fileName,
      path: entryPath,
      lines: lineCount,
      content: textContent
    });

    // Parse key configuration and architecture files
    analyzeFileContent(entryPath, fileName, ext, textContent, manifest);
  }

  // Convert Set of detected stack to Array
  manifest.detectedStack = Array.from(manifest.detectedStack);

  // Build clean visual file tree (max depth 4, top 50 nodes)
  manifest.fileTree = buildVisualTree(Array.from(fileMap.keys()));

  // Prepare a combined representative code snippet (max 35KB) for AI synthesis
  manifest.representativeCodeText = manifest.representativeCode
    .map(c => `// File: ${c.path} (${c.type})\n${c.snippet}`)
    .join('\n\n')
    .slice(0, 35000);

  // Calculate percentage of languages
  const totalLoc = manifest.totalLinesOfCode || 1;
  const langPercentage = {};
  for (const [l, count] of Object.entries(manifest.languages)) {
    const pct = Math.round((count / totalLoc) * 100);
    if (pct > 0) langPercentage[l] = pct;
  }
  manifest.languages = langPercentage;

  return manifest;
}

function detectLanguage(ext, fileName) {
  if (fileName.toLowerCase().includes('dockerfile')) return 'Docker';
  switch (ext) {
    case '.ts': case '.tsx': return 'TypeScript';
    case '.js': case '.jsx': return 'JavaScript';
    case '.py': return 'Python';
    case '.go': return 'Go';
    case '.rs': return 'Rust';
    case '.java': return 'Java';
    case '.sql': case '.prisma': return 'SQL / Database';
    case '.yaml': case '.yml': return 'YAML / Infra';
    case '.json': return 'JSON';
    case '.proto': return 'gRPC Protobuf';
    default: return null;
  }
}

function analyzeFileContent(filePath, fileName, ext, content, manifest) {
  const lowerPath = filePath.toLowerCase();
  const lowerName = fileName.toLowerCase();

  // 1. Dependencies & Framework Detection
  if (lowerName === 'package.json') {
    try {
      const pkg = JSON.parse(content);
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      for (const d of Object.keys(deps)) {
        manifest.dependencies.push(d);
        if (d.includes('express')) manifest.detectedStack.add('Express.js');
        if (d.includes('fastify')) manifest.detectedStack.add('Fastify');
        if (d.includes('nest')) manifest.detectedStack.add('NestJS');
        if (d.includes('react')) manifest.detectedStack.add('React');
        if (d.includes('vue')) manifest.detectedStack.add('Vue');
        if (d.includes('prisma')) manifest.detectedStack.add('Prisma ORM');
        if (d.includes('pg') || d.includes('postgres')) manifest.detectedStack.add('PostgreSQL');
        if (d.includes('redis') || d.includes('ioredis')) manifest.detectedStack.add('Redis');
        if (d.includes('kafka') || d.includes('kafkajs')) manifest.detectedStack.add('Apache Kafka');
        if (d.includes('qdrant') || d.includes('chroma') || d.includes('pinecone')) manifest.detectedStack.add('Vector Database');
        if (d.includes('socket.io') || d.includes('ws')) manifest.detectedStack.add('WebSocket Gateway');
      }
    } catch (e) {}
  }

  if (lowerName === 'requirements.txt' || lowerName === 'pipfile' || lowerName === 'pyproject.toml') {
    const lines = content.split('\n');
    for (const l of lines) {
      const dep = l.split(/[=<>~]/)[0].trim().toLowerCase();
      if (dep) {
        manifest.dependencies.push(dep);
        if (dep.includes('fastapi')) manifest.detectedStack.add('FastAPI');
        if (dep.includes('flask')) manifest.detectedStack.add('Flask');
        if (dep.includes('django')) manifest.detectedStack.add('Django');
        if (dep.includes('torch') || dep.includes('pytorch')) manifest.detectedStack.add('PyTorch AI');
        if (dep.includes('vllm') || dep.includes('triton')) manifest.detectedStack.add('vLLM Model Serving');
        if (dep.includes('qdrant')) manifest.detectedStack.add('Qdrant Vector DB');
        if (dep.includes('chromadb')) manifest.detectedStack.add('ChromaDB');
        if (dep.includes('langchain') || dep.includes('langgraph')) manifest.detectedStack.add('LangGraph Agents');
        if (dep.includes('celery')) manifest.detectedStack.add('Celery Task Queue');
        if (dep.includes('redis')) manifest.detectedStack.add('Redis');
        if (dep.includes('psycopg2') || dep.includes('asyncpg')) manifest.detectedStack.add('PostgreSQL');
      }
    }
  }

  if (lowerName.includes('docker-compose')) {
    manifest.detectedStack.add('Docker Compose');
    // Extract services
    const serviceMatches = content.match(/^\s{2}([a-zA-Z0-9_-]+):\s*$/gm);
    if (serviceMatches) {
      serviceMatches.forEach(m => {
        const sName = m.replace(':', '').trim();
        if (sName !== 'services' && sName !== 'version') {
          manifest.dockerServices.push(sName);
        }
      });
    }
  }

  // 2. Extract Route Endpoints
  // Express / Node routes: app.get('/...', ...), router.post('/...', ...)
  const expressRouteRegex = /(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  let match;
  while ((match = expressRouteRegex.exec(content)) !== null) {
    if (manifest.routes.length < 25) {
      manifest.routes.push({
        method: match[1].toUpperCase(),
        path: match[2],
        file: filePath
      });
    }
  }

  // Python FastAPI / Flask routes: @app.get("..."), @router.post("...")
  const pythonRouteRegex = /@(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  while ((match = pythonRouteRegex.exec(content)) !== null) {
    if (manifest.routes.length < 25) {
      manifest.routes.push({
        method: match[1].toUpperCase(),
        path: match[2],
        file: filePath
      });
    }
  }

  // 3. Extract Database Models / Entities
  // Python SQLAlchemy / Pydantic: class UserModel(Base): or class User(BaseModel):
  const pyClassRegex = /class\s+([A-Za-z0-9_]+)\s*\((?:Base|BaseModel|Model|db\.Model)\):/g;
  while ((match = pyClassRegex.exec(content)) !== null) {
    if (manifest.models.length < 15) {
      manifest.models.push({
        name: match[1],
        kind: 'ORM Model',
        file: filePath
      });
    }
  }

  // Prisma Schema models: model User {
  const prismaModelRegex = /model\s+([A-Za-z0-9_]+)\s*\{/g;
  while ((match = prismaModelRegex.exec(content)) !== null) {
    if (manifest.models.length < 15) {
      manifest.models.push({
        name: match[1],
        kind: 'Prisma Table',
        file: filePath
      });
    }
  }

  // TypeScript interfaces / type entities
  if (lowerPath.includes('model') || lowerPath.includes('entity') || lowerPath.includes('schema')) {
    const tsInterfaceRegex = /export\s+(?:interface|type)\s+([A-Za-z0-9_]+)/g;
    while ((match = tsInterfaceRegex.exec(content)) !== null) {
      if (manifest.models.length < 15) {
        manifest.models.push({
          name: match[1],
          kind: 'TypeScript Contract',
          file: filePath
        });
      }
    }
  }

  // 4. Capture representative file samples for AI synthesis
  const isHighPriority =
    lowerName === 'package.json' ||
    lowerName === 'requirements.txt' ||
    lowerName === 'docker-compose.yml' ||
    lowerName === 'schema.prisma' ||
    lowerName.includes('server') ||
    lowerName.includes('main') ||
    lowerName.includes('app') ||
    lowerPath.includes('route') ||
    lowerPath.includes('controller') ||
    lowerPath.includes('model');

  if (isHighPriority && manifest.representativeCode.length < 8) {
    manifest.representativeCode.push({
      path: filePath,
      type: lowerPath.includes('model') ? 'Database Entity' : lowerPath.includes('route') ? 'API Route' : 'Service Entry',
      snippet: content.slice(0, 3500)
    });
  }
}

/**
 * Builds a compact visual tree structure from file paths
 */
function buildVisualTree(paths) {
  const root = { name: 'root', type: 'directory', children: {} };

  for (const p of paths.slice(0, 45)) {
    const parts = p.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (isFile) {
        current.children[part] = { name: part, type: 'file', path: p };
      } else {
        if (!current.children[part]) {
          current.children[part] = { name: part, type: 'directory', children: {} };
        }
        current = current.children[part];
      }
    }
  }

  function convertToArray(node) {
    if (node.type === 'file') return node;
    const childrenArr = Object.values(node.children || {}).map(convertToArray);
    return {
      name: node.name,
      type: 'directory',
      children: childrenArr
    };
  }

  return Object.values(root.children).map(convertToArray);
}

module.exports = {
  parseCodebaseZip
};
