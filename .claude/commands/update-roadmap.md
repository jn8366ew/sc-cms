`.claude/tasks/` 내 phase 파일들을 읽어 완료된 작업을 확인하고, `docs/ROADMAP.md`의 상태를 동기화한다.

## 실행 절차

### 1단계 — task 파일 전체 읽기

#### `.claude/tasks/` 루트 파일 (현재 진행 중인 Phase)

`tasks/` 루트에 있는 파일을 모두 읽는다:
- `tasks/phase6-admin-upgrade.md`
- (이후 추가되는 phase 파일도 동일하게 읽는다)

각 파일에서 다음 정보를 추출한다:
- frontmatter의 `phase`, `title`, `status`
- 각 task 항목(## #N ...)의 **상태** 값 (✅ completed / 🔲 pending / 🟡 partial)

#### `.claude/tasks/v1/` 서브폴더 (완료된 Phase 1)

`tasks/v1/` 폴더 내 파일들은 **Phase 1 MVP가 이미 완료된 태스크**들이다.
- ROADMAP.md에 이미 반영되어 있다면 **읽지 않고 pass**.
- 특정 태스크 상태 확인이 필요한 경우에만 해당 파일만 선택적으로 읽는다.

v1 파일 목록 (참고용):
- `tasks/v1/phase1-skeleton.md`
- `tasks/v1/phase2-common-modules.md`
- `tasks/v1/phase3-core-features.md`
- `tasks/v1/phase4-extra-features.md`
- `tasks/v1/phase5-optimize-deploy.md`

### 2단계 — ROADMAP.md 읽기

`docs/ROADMAP.md`를 읽는다.

### 3단계 — 상태 동기화 규칙

**개별 task 행 상태 컬럼** 업데이트:
| task 파일 상태 | ROADMAP.md 반영값 |
|---|---|
| ✅ completed | ✅ |
| 🔲 pending   | 🔲 |
| 🟡 partial   | 🟡 |

**Step 전체 상태** (`**상태**: ...` 줄) 집계:
- 해당 Step의 모든 task가 ✅ → `✅ 완료 (YYYY-MM-DD)`
- 일부 ✅, 나머지 🔲/🟡 혼재 → `🟡 부분 완료`
- 전부 🔲 → `🔲 미구현 (다음 세션 시작점)`

날짜 표기가 필요한 경우 오늘 날짜를 사용한다.

### 4단계 — Last Updated 날짜 갱신

ROADMAP.md 상단 주석의 `Last Updated` 날짜를 오늘 날짜로 갱신한다.

```
<!-- Last Updated: YYYY-MM-DD | Version: X.X.X -->
```

날짜만 오늘로 바꾸고, Version은 변경하지 않는다.

### 5단계 — ROADMAP.md 저장

변경된 내용을 `docs/ROADMAP.md`에 반영한다.

### 6단계 — 변경 요약 출력

다음 형식으로 요약을 출력한다:

```
## ROADMAP 동기화 완료

**Last Updated**: YYYY-MM-DD

### 변경된 항목
- Step N (제목): [이전 상태] → [새 상태]
- Task #N (항목명): [이전 상태] → [새 상태]
...

### 변경 없음
- Step N (제목): 이미 최신 상태
...
```

변경이 전혀 없으면 "모든 상태가 이미 최신입니다." 를 출력한다.
