<template>
  <div class="about-contact">
    <h1>📞 联系我们</h1>
    <p>欢迎随时与我们取得联系，我们将尽快回复您的留言：</p>

    <ul>
      <li>
        <span class="icon">📱</span>
        <a href="tel:010-12345678" class="link-text">010-12345678</a>
      </li>
      <li>
        <span class="icon">✉️</span>
        <a href="mailto:info@feiyi.com" class="link-text">info@feiyi.com</a>
      </li>
      <li>
        <span class="icon">📍</span>
        北京市海淀区文化路123号
      </li>
      <li>
        <span class="icon">💬</span>
        微信：
        <img
          src="@/assets/contact/wx.png"
          alt="微信二维码"
          class="wechat-qrcode"
        />
      </li>
    </ul>

    <div class="divider"></div>

    <p class="footer-note">感谢您的关注！期待与您的合作。</p>
  </div>
</template>

<script>
export default {
  name: "AboutContact",
};
</script>

<style scoped>
.about-contact {
  background: #ffffff;
  padding: 40px 24px;
  border-radius: 20px;
  max-width: 620px;
  margin: 0 auto;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  color: #333;
  font-family: "Helvetica Neue", "PingFang SC", sans-serif;
  animation: fadeIn 0.8s ease;
}

.about-contact h1 {
  font-size: 36px;
  margin-bottom: 24px;
  color: #b91c1c;
  text-align: center;
  position: relative;
  animation: slideIn 0.6s ease;
}

.about-contact h1::after {
  content: "";
  display: block;
  width: 80px;
  height: 3px;
  margin: 12px auto 0;
  background: linear-gradient(to right, #b91c1c, #f87171);
  border-radius: 2px;
}

.about-contact p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
  color: #444;
}

.about-contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.about-contact li {
  margin-bottom: 18px;
  font-size: 17px;
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: #fafafa;
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.about-contact li:hover {
  background: linear-gradient(to right, #fff, #fef2f2);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(185, 28, 28, 0.12);
}

.icon {
  margin-right: 10px;
  font-size: 20px;
  color: #b91c1c;
  transition: transform 0.3s;
}

.about-contact li:hover .icon {
  transform: scale(1.2);
}

.link-text {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.link-text:hover {
  color: #b91c1c;
}

.wechat-qrcode {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-left: 12px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.wechat-qrcode:hover {
  transform: scale(1.1);
  border-color: #b91c1c;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 30px 0;
}

.footer-note {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
