# CIS KKU Demo Client (สรุปสั้น ๆ)

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

ข้อควรทราบ
- หากเรียก API จากเบราว์เซอร์และพบปัญหา CORS (preflight ถูกบล็อก) ให้รันแอปผ่าน Expo Go (native) หรือใช้ proxy ระหว่างเครื่องพัฒนาและ API server หรือตรึงการตั้งค่า CORS ที่ฝั่งเซิร์ฟเวอร์
- โปรเจคนี้เก็บ `apiKey` ใน storage และจะโหลดโดยอัตโนมัติ — ผู้ใช้ไม่จำเป็นต้องกรอก API key ที่หน้า Sign In

ต้องการให้ช่วยต่อไหม
- ต้องการให้ผมเพิ่มสคริปต์ช่วยตั้งค่า `apiKey` สำหรับการพัฒนา, หรือเขียนตัวอย่าง proxy เล็ก ๆ เพื่อเลี่ยง CORS ไหม? บอกผมได้เลยว่าต้องการแบบไหน
