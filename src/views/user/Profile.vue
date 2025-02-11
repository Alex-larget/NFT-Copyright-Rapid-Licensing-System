<template>
  <div class="profile-container">
    <div class="profile-header">
      <el-avatar 
        :src="userStore.userInfo.value?.avatar" 
        :size="120"
      />
      <div class="user-info">
        <h2>{{ userStore.userInfo.value?.username }}</h2>
        <p>钱包地址：{{ userStore.userInfo.value?.wallet }}</p>
      </div>
    </div>

    <el-tabs type="border-card">
      <el-tab-pane label="我的作品">
        <el-row :gutter="20">
          <el-col 
            v-for="nft in userNfts" 
            :key="nft.id" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
          >
            <el-card shadow="hover">
              <img :src="nft.creatorAvatar" class="nft-avatar" />
              <div class="nft-info">
                <h3>{{ nft.name }}</h3>
                <p>{{ nft.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="交易记录">
        <el-table :data="tradeRecords">
          <el-table-column prop="id" label="交易ID" />
          <el-table-column prop="type" label="交易类型" />
          <el-table-column prop="amount" label="金额" />
          <el-table-column prop="date" label="日期" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="账户设置">
        <el-form 
          ref="profileFormRef"
          :model="editForm"
          :rules="profileRules"
          @submit.prevent="handleUpdateProfile"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" />
          </el-form-item>
          <el-button 
            type="primary" 
            native-type="submit"
            :loading="loading"
          >
            保存修改
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getNftList } from '@/api/nft'
import { updateUserProfile } from '@/api/user'
import { OriginalNft } from '@/types/nft'

const userStore = useUserStore()

const userNfts = ref<OriginalNft[]>([])
const tradeRecords = ref([
  { id: '1', type: '购买', amount: '100 USDT', date: '2023-06-15' },
  { id: '2', type: '出售', amount: '200 USDT', date: '2023-06-10' }
])

const editForm = ref({
  username: userStore.userInfo.value?.username || '',
  email: userStore.userInfo.value?.email || ''
})

const loading = ref(false)
const profileFormRef = ref()

const profileRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱地址' }
  ]
}

const handleUpdateProfile = async () => {
  await profileFormRef.value.validate()
  
  loading.value = true
  try {
    const updatedUser = await updateUserProfile(editForm.value)
    userStore.setUserInfo(updatedUser)
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const response = await getNftList()
  userNfts.value = response.data.list
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.user-info {
  margin-left: 20px;
}

.nft-avatar {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
</style> 