# 📱 CIS KKU Mobile App

แอปพลิเคชันมือถือสำหรับนักศึกษามหาวิทยาลัยขอนแก่น สร้างด้วย **Expo (React Native)** เพื่อเชื่อมต่อกับระบบ CIS KKU

## ✨ ฟีเจอร์หลัก

### 🔐 การเข้าสู่ระบบ
- ล็อกอินด้วยอีเมลและรหัสผ่าน
- เก็บข้อมูลการเข้าสู่ระบบอัตโนมัติ
- ระบบ API Key ที่ปลอดภัย

### 📰 Social Feed
- **ดูโพสของเพื่อน** ในหน้า Feed
- **เขียนโพสใหม่** พร้อมข้อความ
- **กดไลค์** โพสที่ชอบ
- **ยกเลิกไลค์** (Unlike) โพสที่เคยไลค์
- **คอมเมนต์** ในโพสต่างๆ
- **ลบโพส** ของตัวเองได้เท่านั้น

### 👥 ข้อมูลสมาชิก
- **ดูโปรไฟล์ตัวเอง** ข้อมูลส่วนตัวและการศึกษา
- **ค้นหาสมาชิกชั้นปี** ตามปีการศึกษา (2020-2025)
- **ข้อมูลครบถ้วน** รหัสนักศึกษา, สาขา, โรงเรียน

## 🚀 วิธีติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันบนอุปกรณ์มือถือ (แนะนำ)

#### 📱 ใช้ Expo Go App
```bash
# เริ่มต้น Expo development server
npm start
# หรือ
expo start
```

**ขั้นตอน:**
1. ติดตั้ง **Expo Go** จาก App Store/Play Store
2. สแกน QR Code ที่แสดงในเทอร์มินัล
3. แอปจะเปิดใน Expo Go ทันที

#### 🤖 รันบน Android
```bash
npm run android
```
*ต้องมี Android Studio และ Android Emulator*

#### 🍎 รันบน iOS (macOS เท่านั้น)
```bash
npm run ios
```
*ต้องมี Xcode และ iOS Simulator*

### 3. รันบนเว็บ (สำหรับทดสอบ)
```bash
npm run web
```

## 📁 โครงสร้างโปรเจกต์

```
Quiz-Hybrid/
├── App.tsx                 # หน้าหลักและ Navigation
├── signin.tsx             # หน้าล็อกอิน
├── src/
│   ├── api.ts             # API Helper และ Authentication
│   └── screens/
│       ├── Home.tsx       # หน้าแรก
│       ├── Feed.tsx       # หน้า Social Feed
│       └── ClassMembers.tsx # หน้าสมาชิกชั้นปี
├── assets/                # รูปภาพและไอคอน
└── package.json           # Dependencies
```

## 🔧 การตั้งค่า

### API Configuration
- API Key ถูกตั้งค่าในโค้ดแล้ว
- ใช้ API ของ CIS KKU: `https://cis.kku.ac.th/api/classroom/`

### Storage
- ใช้ **AsyncStorage** สำหรับเก็บข้อมูลในมือถือ
- ใช้ **localStorage** สำหรับเว็บ
- เก็บข้อมูลการเข้าสู่ระบบอัตโนมัติ

## 📱 วิธีใช้งาน

### 1. เข้าสู่ระบบ
- ใส่อีเมลและรหัสผ่านของมหาวิทยาลัย
- ระบบจะจำข้อมูลการเข้าสู่ระบบ

### 2. หน้า Feed
- **ดูโพสของเพื่อน** ทั้งหมด
- **เขียนโพสใหม่** ที่ด้านบน
- **กดไลค์** และ **ยกเลิกไลค์** ในโพสต่างๆ
- **คอมเมนต์** ในโพสต่างๆ
- **ลบโพส** ของตัวเองได้

### 3. ดูข้อมูล
- **กดปุ่ม 👤** ดูโปรไฟล์ตัวเอง
- **กดปุ่ม 👥** ดูสมาชิกชั้นปี
- **เลือกปีการศึกษา** ที่ต้องการ

## 🛠️ Development

### Hot Reload
- แก้ไขโค้ดแล้วแอปจะอัปเดตทันที
- ใช้ **Fast Refresh** ของ Expo

### Debugging
- เปิด Developer Menu: กด `Ctrl+M` (Android) หรือ `Cmd+D` (iOS)
- ดู Console Logs ในเทอร์มินัล

## 📦 Dependencies หลัก

- **Expo SDK** - Framework หลัก
- **React Native** - UI Framework
- **TypeScript** - Type Safety
- **AsyncStorage** - Local Storage
- **React Navigation** - Navigation

## 🔒 Security

- API Key ถูกจัดการอย่างปลอดภัย
- เฉพาะเจ้าของโพสเท่านั้นที่ลบได้
- ข้อมูลการเข้าสู่ระบบถูกเข้ารหัส

## 📞 Support

หากมีปัญหาการใช้งาน:
1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
2. ลองรีสตาร์ทแอป
3. ตรวจสอบ API Key ในโค้ด

---

**สร้างด้วย ❤️ โดย Expo + React Native**


