# เลือก Base Image ที่ใช้ Node.js
FROM node:16

# ตั้งค่า Working Directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (หรือ yarn.lock) มาจากเครื่องคุณไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดจากเครื่องไปยัง container
COPY . .

# กำหนดพอร์ตที่แอปจะฟัง (port ที่คุณใช้ในแอป)
EXPOSE 3000

# สั่งให้เริ่มต้นแอปพลิเคชัน
CMD ["npm", "start"]
