# CIS KKU Demo 

โปรเจคตัวอย่างเล็ก ๆ ที่สร้างด้วย Expo (React Native for Web + TypeScript) เพื่อทดสอบการเรียกใช้งาน API ของ CIS KKU (เช่น ล็อกอิน, ดึงข้อมูลสมาชิกชั้นเรียน, โพสต์สถานะ, คอมเมนท์ และไลค์/ยกเลิกไลค์)

วิธีรัน (Windows / PowerShell)

1. ติดตั้ง dependencies ถ้ายังไม่ได้ติดตั้ง:

```powershell
npm install
```

2. รันในโหมดเว็บ:

```powershell
npm run web
```

แล้วเปิด URL ที่ Expo แสดงในเบราว์เซอร์

รันบน Expo (native) — Android / iOS / Expo Go

ถ้าต้องการทดสอบบนอุปกรณ์จริงหรือ emulator ให้รัน Metro/Expo แล้วเปิดบน Expo Go:

```powershell
# เปิด Expo dev tools
npm run start

# รันและเปิดบน Android (ต้องมี emulator หรือ device ที่เชื่อมต่อ)
npm run android

# รันและเปิดบน iOS (macOS ที่มี Xcode เท่านั้น)
npm run ios
```

- บนมือถือ: สแกน QR code ที่ Expo แสดงเพื่อเปิดแอปด้วย Expo Go (Android/iOS)
- หากยังไม่ได้ติดตั้ง AsyncStorage บน native (บางกรณี) ให้รัน:

```powershell
expo install @react-native-async-storage/async-storage
```

ไฟล์สำคัญ
- `App.tsx` — ตัวเข้า (router) ระหว่างหน้าต่าง ๆ
- `signin.tsx` — แบบฟอร์มล็อกอิน (ตอนนี้ API key ถูกจัดการเบื้องหลัง)
- `src/api.ts` — ตัวช่วยเรียก API (headers, timeout, storage)
- `src/screens/*` — หน้าหลัก, สมาชิกชั้นเรียน, Feed


