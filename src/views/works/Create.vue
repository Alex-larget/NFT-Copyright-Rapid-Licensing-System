<template>
  <div class="nft-create-container">
    <h2>创建 NFT</h2>
    <el-form 
      ref="nftFormRef"
      :model="nftForm"
      :rules="nftRules"
      label-width="120px"
    >
      <el-form-item label="作品名称" prop="name">
        <el-input v-model="nftForm.name" />
      </el-form-item>

      <el-form-item label="作品描述" prop="description">
        <el-input 
          v-model="nftForm.description" 
          type="textarea" 
          :rows="4"
        />
      </el-form-item>

      <el-form-item label="上传封面" prop="cover">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img 
            v-if="nftForm.cover" 
            :src="nftForm.cover" 
            class="avatar"
          >
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="版权类型" prop="copyrightType">
        <el-radio-group v-model="nftForm.copyrightType">
          <el-radio :label="CopyrightType.ORIGINAL">原创</el-radio>
          <el-radio :label="CopyrightType.CHILD">衍生</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="发行数量" prop="maxCount">
        <el-input-number 
          v-model="nftForm.maxCount"
          :min="1"
          :max="10000"
        />
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitNft"
          :loading="loading"
        >
          提交作品
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { CopyrightType } from '@/types/nft'
import { createNft } from '@/api/nft'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const nftFormRef = ref()

const nftForm = reactive({
  name: '',
  description: '',
  cover: '',
  copyrightType: CopyrightType.ORIGINAL,
  maxCount: 1
})

const nftRules = {
  name: [
    { required: true, message: '请输入作品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入作品描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ],
  cover: [
    { required: true, message: '请上传封面' }
  ]
}

const handleAvatarSuccess = (res: any) => {
  nftForm.cover = res.imageUrl
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const submitNft = async () => {
  await nftFormRef.value.validate()
  
  loading.value = true
  try {
    await createNft(nftForm)
    ElMessage.success('创建成功')
    router.push('/works')
  } catch (error) {
    ElMessage.error('创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.nft-create-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-light);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style> 