<template>
  <div class="about-container">
    <div class="about-content">
      <h2>关于我们</h2>
      
      <section class="section platform-intro">
        <h3>平台介绍</h3>
        <p>我们是一个专注于数字艺术品NFT交易的平台，致力于为艺术家和收藏者提供安全、便捷的交易环境。</p>
      </section>

      <section class="section advantages">
        <h3>我们的优势</h3>
        <ul>
          <li>版权保护：严格的版权认证机制，保护创作者权益</li>
          <li>灵活交易：支持转让和授权两种交易方式</li>
          <li>溯源机制：完整的藏品溯源链，确保真实可靠</li>
          <li>安全保障：区块链技术支持，交易安全有保障</li>
        </ul>
      </section>

      <section class="section team-section">
        <h3>团队成员</h3>
        <div class="team-grid">
          <div class="team-member" v-for="member in teamMembers" :key="member.id">
            <div class="avatar">
              {{ member.name.charAt(0) }}
            </div>
            <div class="name">{{ member.name }}</div>
            <div class="role">{{ member.role }}</div>
          </div>
        </div>
      </section>

      <section class="section contact-section">
        <h3 class="contact-title">联系我们</h3>
        <p class="contact-description">
          邮箱：support@example.com<br>
          电话：400-123-4567<br>
          地址：北京市朝阳区xxx大厦
        </p>
        <a href="mailto:support@example.com" class="contact-button">联系我们</a>
      </section>
    </div>
  </div>
</template>

<script setup>
const teamMembers = [
  { id: 1, name: '张三', role: '创始人' },
  { id: 2, name: '李四', role: '技术总监' },
  { id: 3, name: '王五', role: '产品经理' },
  { id: 4, name: '赵六', role: '设计师' }
]
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  .about-content {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 28px;
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }

    .section {
      margin-bottom: 30px;

      h3 {
        font-size: 20px;
        color: #333;
        margin-bottom: 16px;
        border-bottom: 2px solid @primary-color;
        padding-bottom: 10px;
      }

      p, ul {
        color: #666;
        line-height: 1.6;
      }

      ul {
        list-style-type: disc;
        padding-left: 20px;
      }
    }

    .team-section {
      .team-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .team-member {
          text-align: center;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          transition: transform 0.3s;

          &:hover {
            transform: translateY(-5px);
          }

          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: @primary-color;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 36px;
          }

          .name {
            font-weight: bold;
            margin-bottom: 5px;
          }

          .role {
            color: #666;
            font-size: 14px;
          }
        }
      }
    }

    .contact-section {
      text-align: center;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 30px;

      .contact-title {
        margin-bottom: 20px;
        color: #333;
      }

      .contact-description {
        margin-bottom: 20px;
        color: #666;
      }

      .contact-button {
        display: inline-block;
        background: @primary-color;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        transition: background 0.3s;

        &:hover {
          background: darken(@primary-color, 10%);
        }
      }
    }
  }
}
</style> 