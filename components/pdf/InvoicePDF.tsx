import path from 'path'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Invoice } from '@/types/invoice'

// ---------------------------------------------------------------------------
// 폰트 등록
// 전체 한국어 글리프 포함 TTF (~5.9MB) — 절대 경로 직접 등록
// ---------------------------------------------------------------------------
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Regular.ttf'),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Bold.ttf'),
      fontWeight: 700,
    },
  ],
})

// 하이픈을 단어 경계로 인식해 이메일/주소가 쪼개지는 문제 방지
// "con-tact@..." → 5줄로 분리되던 현상 해결
Font.registerHyphenationCallback((word) => [word])

// ---------------------------------------------------------------------------
// 발행자 상수 — InvoiceView.tsx와 동일하게 유지
// ---------------------------------------------------------------------------
const ISSUER = {
  name: '(주)스타트컴퍼니',
  registration: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123, 4층',
  tel: '02-1234-5678',
  email: 'contact@startcompany.kr',
  manager: '홍길동',
}

// ---------------------------------------------------------------------------
// 유틸
// ---------------------------------------------------------------------------
function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

function formatDate(iso: string): string {
  if (!iso) return '-'
  const [year, month, day] = iso.split('-')
  return `${year}년 ${month}월 ${day}일`
}

// ---------------------------------------------------------------------------
// 스타일
// @react-pdf/renderer는 웹 CSS 미지원. flexbox 기반, 단위는 pt.
// ---------------------------------------------------------------------------
const c = {
  bg: '#ffffff',
  border: '#e4e4e7',        // zinc-200
  borderStrong: '#18181b',  // zinc-900
  textPrimary: '#18181b',   // zinc-900
  textSecondary: '#52525b', // zinc-600
  textMuted: '#a1a1aa',     // zinc-400
  bgMuted: '#f4f4f5',       // zinc-100
  bgTableEven: '#fafafa',   // zinc-50
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 9,
    color: c.textPrimary,
    backgroundColor: c.bg,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
  },

  // ── 헤더 ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  // 발행자 블록에 고정 너비를 줘서 주소/이메일 텍스트 줄바꿈 방지
  issuerBlock: { width: 220 },
  issuerName: { fontSize: 11, fontWeight: 700, marginBottom: 3 },
  issuerRegNo: { fontSize: 8, color: c.textMuted, marginBottom: 6 },
  issuerRow: { flexDirection: 'row', marginBottom: 3 },
  issuerLabel: { width: 36, color: c.textMuted, fontSize: 8, flexShrink: 0 },
  issuerValue: { color: c.textSecondary, fontSize: 8, flex: 1 },

  // 제목 블록 — 상태 배지 제거 (클라이언트 수신 문서에 불필요)
  titleBlock: { alignItems: 'flex-end' },
  titleText: { fontSize: 22, fontWeight: 700 },
  invoiceNumberText: { fontSize: 8, color: c.textMuted, marginTop: 3 },

  // ── 구분선 ──
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    marginVertical: 14,
  },

  // ── 수신자 / 발행 정보 ──
  // BUG-5: row → column 구조로 변경 (수신자 위, 발행 메타 아래)
  infoSection: {
    flexDirection: 'column',
    backgroundColor: c.bgMuted,
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
  },
  recipientBlock: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  recipientLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: c.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  recipientName: { fontSize: 14, fontWeight: 700 },
  recipientSuffix: { fontSize: 11, fontWeight: 400, color: c.textMuted },

  metaBlock: { flexDirection: 'column' },
  metaRow: { flexDirection: 'row', marginBottom: 4 },
  // BUG-4: 고정 너비로 label/value 시작 위치 통일 ("견적서 번호" 기준)
  metaLabel: { width: 60, fontSize: 8, color: c.textMuted, fontWeight: 700 },
  metaValue: { fontSize: 8, color: c.textSecondary },

  // ── 항목 테이블 ──
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: c.bgMuted,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: c.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableRowEven: { backgroundColor: c.bgTableEven },

  colName: { flex: 1 },
  colQty: { width: 36, textAlign: 'right' },
  colPrice: { width: 64, textAlign: 'right' },
  colAmount: { width: 72, textAlign: 'right' },

  thText: { fontSize: 7, fontWeight: 700, color: c.textMuted, textTransform: 'uppercase' },
  tdText: { fontSize: 9, color: c.textSecondary },
  tdNameText: { fontSize: 9, fontWeight: 700, color: c.textPrimary },
  tdAmountText: { fontSize: 9, fontWeight: 700, color: c.textPrimary },

  // ── 합계 영역 ──
  // BUG-7: 공급가액 / 부가세 / 최종합계(VAT 포함) 3행 구조
  totalSeparator: {
    borderTopWidth: 2,
    borderTopColor: c.borderStrong,
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 16,
  },
  amountLabel: {
    fontSize: 8,
    color: c.textMuted,
    width: 90,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: 8,
    color: c.textSecondary,
    width: 80,
    textAlign: 'right',
  },
  grandTotalSeparator: {
    borderTopWidth: 1,
    borderTopColor: c.border,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 2,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
    gap: 16,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: c.textSecondary,
    width: 90,
    textAlign: 'right',
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: 700,
    width: 80,
    textAlign: 'right',
  },

  // ── 푸터 ──
  footer: {
    marginTop: 'auto',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: c.border,
    alignItems: 'center',
  },
  footerText: { fontSize: 7.5, color: c.textMuted, textAlign: 'center', lineHeight: 1.6 },
})

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------
interface InvoicePDFProps {
  invoice: Invoice
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  // BUG-7: VAT 계산 — 컴포넌트 내부에서 처리 (타입 변경 불필요)
  const subtotal = invoice.total_amount
  const vat = Math.round(subtotal * 0.1)
  const grandTotal = subtotal + vat

  return (
    <Document
      title={`견적서 ${invoice.invoice_number}`}
      author={ISSUER.name}
      creator={ISSUER.name}
    >
      <Page size="A4" style={styles.page}>

        {/* ── 헤더: 발행자(좌) / 제목(우) ── */}
        <View style={styles.header}>
          {/* 발행자 — 고정 너비로 주소/이메일 줄바꿈 방지 (BUG-1, BUG-2) */}
          <View style={styles.issuerBlock}>
            <Text style={styles.issuerName}>{ISSUER.name}</Text>
            <Text style={styles.issuerRegNo}>사업자등록번호 {ISSUER.registration}</Text>
            <View style={styles.issuerRow}>
              <Text style={styles.issuerLabel}>주소</Text>
              <Text style={styles.issuerValue}>{ISSUER.address}</Text>
            </View>
            <View style={styles.issuerRow}>
              <Text style={styles.issuerLabel}>전화</Text>
              <Text style={styles.issuerValue}>{ISSUER.tel}</Text>
            </View>
            <View style={styles.issuerRow}>
              <Text style={styles.issuerLabel}>이메일</Text>
              <Text style={styles.issuerValue}>{ISSUER.email}</Text>
            </View>
            <View style={styles.issuerRow}>
              <Text style={styles.issuerLabel}>담당</Text>
              <Text style={styles.issuerValue}>{ISSUER.manager}</Text>
            </View>
          </View>

          {/* 제목 — 상태 배지 제거 (BUG-3) */}
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>견적서</Text>
            <Text style={styles.invoiceNumberText}>{invoice.invoice_number}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* ── 수신자(위) / 발행 메타(아래) — BUG-5 ── */}
        <View style={styles.infoSection}>
          <View style={styles.recipientBlock}>
            <Text style={styles.recipientLabel}>수신</Text>
            <Text style={styles.recipientName}>
              {invoice.client_name}
              <Text style={styles.recipientSuffix}> 귀중</Text>
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              {/* BUG-4: metaLabel 고정 너비로 value 시작 위치 통일 */}
              <Text style={styles.metaLabel}>견적서 번호</Text>
              <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>발행일</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.issue_date)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>유효기간</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.valid_until)}</Text>
            </View>
          </View>
        </View>

        {/* ── 항목 테이블 ── */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colName]}>품목명</Text>
            <Text style={[styles.thText, styles.colQty]}>수량</Text>
            <Text style={[styles.thText, styles.colPrice]}>단가</Text>
            <Text style={[styles.thText, styles.colAmount]}>금액</Text>
          </View>

          {invoice.items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowEven : {}]}
            >
              <Text style={[styles.tdNameText, styles.colName]}>{item.name}</Text>
              <Text style={[styles.tdText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tdText, styles.colPrice]}>{formatKRW(item.unit_price)}</Text>
              <Text style={[styles.tdAmountText, styles.colAmount]}>{formatKRW(item.amount)}</Text>
            </View>
          ))}

          {/* ── 합계: 공급가액 / 부가세 / 최종합계(VAT 포함) — BUG-6, BUG-7 ── */}
          <View style={styles.totalSeparator} />
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>공급가액</Text>
            <Text style={styles.amountValue}>{formatKRW(subtotal)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>부가세(VAT 10%)</Text>
            <Text style={styles.amountValue}>{formatKRW(vat)}</Text>
          </View>
          <View style={styles.grandTotalSeparator} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>합계 (VAT 포함)</Text>
            <Text style={styles.grandTotalAmount}>{formatKRW(grandTotal)}</Text>
          </View>
        </View>

        {/* ── 푸터 ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            본 견적서는 {formatDate(invoice.valid_until)}까지 유효합니다.{'\n'}
            문의사항은 {ISSUER.email}로 연락 주십시오.
          </Text>
        </View>

      </Page>
    </Document>
  )
}
