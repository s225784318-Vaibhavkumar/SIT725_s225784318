
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE 
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT 
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter((r) => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
      `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
      `|TYPE=${coverageTracker.TYPE}` +
      `|REQUIRED=${coverageTracker.REQUIRED}` +
      `|BOUNDARY=${coverageTracker.BOUNDARY}` +
      `|LENGTH=${coverageTracker.LENGTH}` +
      `|TEMPORAL=${coverageTracker.TEMPORAL}` +
      `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
      `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
      `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {
  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}



function makeValidBook(id) {
  return {
    id,
    title: "Clean Code",
    author: "Robert Martin",
    year: 2008,
    genre: "Software",
    summary: "A practical guide to writing readable and maintainable software.",
    price: "34.95",
  };
}

function makeValidUpdate() {
  return {
    title: "Clean Code Revised",
    author: "Robert C. Martin",
    year: 2009,
    genre: "Software Engineering",
    summary: "An updated edition focused on maintainable and expressive code.",
    price: "39.95",
  };
}

// =============================
// REQUIRED BASE TESTS 
// =============================

async function run() {
  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: [],
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"],
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"],
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"],
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"],
  });

  // ---- T06 Required field CREATE ----
  await test({
    id: "T06",
    name: "Missing required title on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      id: `b${Date.now() + 2}`,
      author: "Robert Martin",
      year: 2008,
      genre: "Software",
      summary: "A practical guide to writing readable and maintainable software.",
      price: "34.95",
    },
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  // ---- T07 Wrong TYPE CREATE ----
  await test({
    id: "T07",
    name: "Wrong type for year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 3}`), year: "not-a-number" },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  // ---- T08 BOUNDARY CREATE ----
  await test({
    id: "T08",
    name: "Year below minimum on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 4}`), year: 1799 },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  // ---- T09 LENGTH CREATE ----
  await test({
    id: "T09",
    name: "Title too short on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 5}`), title: "It" },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  // ---- T10 TEMPORAL CREATE ----
  await test({
    id: "T10",
    name: "Future year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 6}`), year: new Date().getFullYear() + 1 },
    tags: ["CREATE_FAIL", "TEMPORAL"],
  });

  // ---- T11 Wrong TYPE UPDATE ----
  await test({
    id: "T11",
    name: "Wrong type for price on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: { amount: 12.5 } },
    tags: ["UPDATE_FAIL", "TYPE"],
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch((err) => {
  console.error("ERROR", err);
  process.exit(2);
});
