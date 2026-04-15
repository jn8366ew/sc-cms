// playwright.config.ts에서 port 3000 사용 여부를 동기적으로 확인하기 위한 헬퍼
// Windows/Unix 모두 동작하는 net 모듈 기반 구현
import net from 'net'

const port = parseInt(process.argv[2] ?? '3000', 10)

const socket = new net.Socket()
socket.setTimeout(1000)

socket.on('connect', () => {
  socket.destroy()
  process.exit(0) // 연결 성공 = 포트 사용 중
})

socket.on('timeout', () => {
  socket.destroy()
  process.exit(1)
})

socket.on('error', () => {
  process.exit(1) // 연결 실패 = 포트 사용 안 함
})

socket.connect(port, 'localhost')
