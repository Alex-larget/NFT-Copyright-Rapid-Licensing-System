<template>
  <div class="user-profile">
    <h2>资料修改</h2>
    
    <el-form
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-width="100px"
      class="profile-form"
    >
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload"
        >
          <el-avatar
            v-if="profileForm.avatar"
            :size="100"
            :src="profileForm.avatar"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="profileForm.nickname" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" />
      </el-form-item>

      <el-form-item label="个人简介" prop="bio">
        <el-input
          v-model="profileForm.bio"
          type="textarea"
          :rows="4"
          placeholder="介绍一下你自己..."
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          保存修改
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 修改密码部分 -->
    <div class="password-section">
      <h3>修改密码</h3>
      <el-form
        ref="pwdFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="pwdLoading"
            @click="handlePasswordChange"
          >
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { updateUserProfile, updatePassword } from '@/api/userCenter'
import { uploadFile } from '@/api/upload'

const userStore = useUserStore()
const formRef = ref()
const pwdFormRef = ref()
const loading = ref(false)
const pwdLoading = ref(false)

// 个人资料表单
const profileForm = reactive({
  avatar: '',
  nickname: '',
  email: '',
  bio: ''
})

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单校验规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '不能超过200个字符', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 头像上传前的校验
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    
    // 调用上传接口
    const res = await uploadFile(formData)
    const url = res.data.url
    profileForm.avatar = url
    ElMessage.success('头像上传成功')
    options.onSuccess() // 通知上传组件上传成功
  } catch (error) {
    ElMessage.error('头像上传失败')
    options.onError() // 通知上传组件上传失败
  }
}

// 提交个人资料修改
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        await updateUserProfile(profileForm)
        ElMessage.success('资料修改成功')
        // 更新store中的用户信息
        userStore.updateUserInfo(profileForm)
      } catch (error) {
        ElMessage.error(error.message || '修改失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 修改密码
const handlePasswordChange = async () => {
  if (!pwdFormRef.value) return
  
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        pwdLoading.value = true
        await updatePassword(passwordForm)
        ElMessage.success('密码修改成功')
        // 清空密码表单
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        ElMessage.error(error.message || '修改失败')
      } finally {
        pwdLoading.value = false
      }
    }
  })
}

// 初始化表单数据
onMounted(() => {
  const userInfo = userStore.userInfo
  if (userInfo) {
    profileForm.avatar = userInfo.avatar
    profileForm.nickname = userInfo.nickname
    profileForm.email = userInfo.email
    profileForm.bio = userInfo.bio
  }
})
</script>

<style lang="scss" scoped>
.user-profile {
  h2 {
    margin: 0 0 20px;
    font-size: 24px;
    color: #333;
  }

  h3 {
    margin: 30px 0 20px;
    font-size: 18px;
    color: #333;
  }

  .profile-form {
    max-width: 600px;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;

      &:hover {
        border-color: $primary-color;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      display: block;
    }
  }

  .password-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    max-width: 600px;
  }
}
</style> 