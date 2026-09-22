// Verify script — chạy bằng: npm run verify:content
// Kiểm tra loader, validation, queries và invalid-detection mà KHÔNG cần
// test framework. Lỗi validation in rõ file | field | reason rồi exit 1.
import {
  ContentError,
  __parseArticleForTest,
  __parseProjectForTest,
  __resetStore,
  getAllArticles,
  getAllComparisons,
  getAllProjects,
  getArticleBySlug,
  getArticlesByType,
  getByTag,
  getComparisonBySlug,
  getProjectBySlug,
  getRelatedContent,
  getRelatedProjects,
} from "@/lib/content";

let pass = 0;
let fail = 0;

function ok(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`PASS  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name} ${extra}`);
  }
}

async function expectError(name: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    fail++;
    console.log(`FAIL  ${name} (không ném lỗi như kỳ vọng)`);
  } catch (e) {
    if (e instanceof ContentError) {
      pass++;
      console.log(`PASS  ${name} → ${e.message}`);
    } else {
      fail++;
      console.log(`FAIL  ${name} (lỗi lạ: ${String(e)})`);
    }
  }
}

const VALID_PROJECT = `---
slug: test-ok
name: Test OK
segment: de-o
status: dang-ban
tier: B
location_label: Test
cover: /x.jpg
cover_alt: Test alt
tags: [vung-tau, gia]
author: ngoan-dang
published_at: 2026-09-01
updated_at: 2026-09-21
sources: []
overview: Test overview
location_text: Test location
price_range_text: Test price
legal: Test legal
legal_status: ro-rang
ngoan_view_verdict: Test verdict
ngoan_view_pros: [a]
ngoan_view_cons: [b]
---
notes
`;

const VALID_ARTICLE = `---
type: knowledge
title: Test
slug: test-ok-article
excerpt: Test excerpt
tags: [phap-ly, vung-tau]
projects: []
author: ngoan-dang
sources: []
published_at: 2026-09-01
updated_at: 2026-09-21
---
Body test.
`;

async function main() {
  __resetStore();

  // --- loader trên content mẫu ---
  const projects = await getAllProjects();
  ok("loader: đọc 8 projects", projects.length === 8, `got ${projects.length}`);
  const articles = await getAllArticles();
  ok("loader: đọc 7 articles", articles.length === 7, `got ${articles.length}`);
  const comparisons = await getAllComparisons();
  ok("loader: đọc 1 comparison mẫu", comparisons.length === 1, `got ${comparisons.length}`);

  // --- slug lookup ---
  const p = await getProjectBySlug("demo-du-an-mau");
  ok("slug lookup: demo-du-an-mau tier A", p?.tier === "A");
  ok("slug lookup: slug lạ → undefined", (await getProjectBySlug("khong-ton-tai")) === undefined);
  const a = await getArticleBySlug("analysis", "demo-phan-tich");
  ok("slug lookup: demo-phan-tich", a?.title.includes("demo") || a?.title.includes("mẫu") ? true : !!a);
  ok("comparison lookup: demo-so-sanh", (await getComparisonBySlug("demo-so-sanh"))?.type === "comparison");

  // --- type filtering ---
  ok("filter: knowledge=3", (await getArticlesByType("knowledge")).length === 3);
  ok("filter: analysis=2", (await getArticlesByType("analysis")).length === 2);
  ok("filter: case-study=1", (await getArticlesByType("case-study")).length === 1);
  ok("filter: tin-tuc=1", (await getArticlesByType("tin-tuc")).length === 1);

  // --- related ---
  const rel = await getRelatedContent("demo-du-an-mau");
  ok(
    "related: demo-du-an-mau có content trỏ tới",
    rel.some((x) => x.slug === "demo-phan-tich") && rel.some((x) => x.slug === "demo-so-sanh")
  );
  const relP = await getRelatedProjects("demo-phan-tich");
  ok("related: demo-phan-tich → demo-du-an-mau", relP.some((x) => x.slug === "demo-du-an-mau"));
  const byTag = await getByTag("vung-tau");
  ok("tag query: vung-tau có project + article", byTag.projects.length >= 1 && byTag.articles.length >= 1);

  // --- noindex độc lập với tier ---
  ok("noindex: sample Tier A set true thủ công", p?.noindex === true);

  // --- invalid detection ---
  const noLegal = VALID_PROJECT.replace("legal: Test legal\n", "");
  await expectError("invalid: Tier B thiếu legal", () => __parseProjectForTest("projects/test-ok.md", noLegal));

  const badSlug = VALID_PROJECT.replace("slug: test-ok", "slug: Sai Slug!!");
  await expectError("invalid: slug sai format", () => __parseProjectForTest("projects/test-ok.md", badSlug));

  const badEnum = VALID_PROJECT.replace("segment: de-o", "segment: bien");
  await expectError("invalid: enum segment", () => __parseProjectForTest("projects/test-ok.md", badEnum));

  const badTag = VALID_PROJECT.replace("[vung-tau, gia]", "[tag-khong-ton-tai, gia]");
  await expectError("invalid: tag ngoài registry", () => __parseProjectForTest("projects/test-ok.md", badTag));

  const noChuDe = VALID_PROJECT.replace("[vung-tau, gia]", "[vung-tau, de-o]");
  await expectError("invalid: thiếu tag chu-de", () => __parseProjectForTest("projects/test-ok.md", noChuDe));

  const badDate = VALID_PROJECT.replace("published_at: 2026-09-01", "published_at: hom-qua");
  await expectError("invalid: ngày sai", () => __parseProjectForTest("projects/test-ok.md", badDate));

  const badRef = VALID_ARTICLE.replace("projects: []", "projects: [du-an-ma]");
  await expectError("invalid: project reference không tồn tại", () =>
    __parseArticleForTest("knowledge/test-ok-article.md", badRef, "knowledge", new Set(["demo-du-an-mau"]))
  );

  const badSource = VALID_ARTICLE.replace("sources: []", "sources:\n  - label: X\n    url: not-a-url\n    noted_at: 2026-09-21").replace(
    "type: knowledge",
    "type: analysis"
  );
  await expectError("invalid: source url sai", () =>
    __parseArticleForTest("analysis/test-ok-article.md", badSource, "analysis", new Set())
  );

  const analysisNoSource = VALID_ARTICLE.replace("type: knowledge", "type: analysis");
  await expectError("invalid: analysis thiếu sources", () =>
    __parseArticleForTest("analysis/test-ok-article.md", analysisNoSource, "analysis", new Set())
  );

  const oneProject = VALID_ARTICLE.replace("type: knowledge", "type: comparison").replace(
    "projects: []",
    "projects: [demo-du-an-mau]"
  ).replace(
    "sources: []",
    "sources:\n  - label: Nguồn demo\n    noted_at: 2026-09-21"
  );
  await expectError("invalid: comparison chỉ 1 project", () =>
    __parseArticleForTest("comparison/test-ok-article.md", oneProject, "comparison", new Set(["demo-du-an-mau"]))
  );

  const caseNoResult = `---
type: case-study
title: Test
slug: test-case
excerpt: Test
tags: [tai-chinh, vung-tau]
projects: []
author: ngoan-dang
sources: []
published_at: 2026-09-01
updated_at: 2026-09-21
case:
  problem: P
  solution: S
---
Body.
`;
  await expectError("invalid: case-study thiếu result", () =>
    __parseArticleForTest("case-study/test-case.md", caseNoResult, "case-study", new Set())
  );

  console.log(`\nKết quả: ${pass} PASS, ${fail} FAIL`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Verify crash:", e instanceof ContentError ? e.message : e);
  process.exit(1);
});
