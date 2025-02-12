<template>
  <div class="admin-collection">
    <h1>藏品管理</h1>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-filter">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="藏品名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入藏品名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="藏品类型">
          <el-select v-model="searchForm.type" placeholder="选择类型" clearable>
            <el-option label="原创" value="original" />
            <el-option label="衍生" value="derivative" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="operation-buttons">
      <el-button type="primary" @click="openCreateNFTDialog">
        <el-icon><Plus /></el-icon>新建藏品
      </el-button>
      <el-button type="success" @click="batchAuthorize">
        <el-icon><Stamp /></el-icon>批量授权
      </el-button>
      <el-button type="warning" @click="batchTransfer">
        <el-icon><Sell /></el-icon>批量转让
      </el-button>
    </div>

    <!-- 藏品列表 -->
    <el-card class="collection-list">
      <el-table
        :data="collectionList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="藏品名称" />
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            {{ scope.row.type === "original" ? "原创" : "衍生" }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="viewNFTDetails(scope.row)">
              详情
            </el-button>
            <el-button type="success" link @click="authorizeNFT(scope.row)">
              授权
            </el-button>
            <el-button type="warning" link @click="transferNFT(scope.row)">
              转让
            </el-button>
            <el-button type="danger" link @click="deleteNFT(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新建/编辑藏品对话框 -->
    <el-dialog
      v-model="nftDialogVisible"
      :title="isEditMode ? '编辑藏品' : '新建藏品'"
      width="600px"
    >
      <el-form :model="currentNFT" label-width="100px">
        <el-form-item label="藏品名称">
          <el-input v-model="currentNFT.name" />
        </el-form-item>
        <el-form-item label="藏品类型">
          <el-select v-model="currentNFT.type">
            <el-option label="原创" value="original" />
            <el-option label="衍生" value="derivative" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number
            v-model="currentNFT.price"
            :precision="2"
            :step="100"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="image-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleImageUploadSuccess"
          >
            <img
              v-if="currentNFT.imageUrl"
              :src="currentNFT.imageUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="nftDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmNFT"> 确认 </el-button>
      </template>
    </el-dialog>

    <!-- 授权对话框 -->
    <el-dialog v-model="authorizeDialogVisible" title="藏品授权" width="500px">
      <el-form :model="authorizeForm" label-width="100px">
        <el-form-item label="授权范围">
          <el-checkbox-group v-model="authorizeForm.scopes">
            <el-checkbox label="商业使用" />
            <el-checkbox label="衍生创作" />
            <el-checkbox label="展览展示" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="授权时间">
          <el-date-picker
            v-model="authorizeForm.duration"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="authorizeDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmAuthorize"> 确认 </el-button>
      </template>
    </el-dialog>

    <!-- 转让对话框 -->
    <el-dialog v-model="transferDialogVisible" title="藏品转让" width="500px">
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="转让地址">
          <el-input v-model="transferForm.address" />
        </el-form-item>
        <el-form-item label="转让价格">
          <el-input-number
            v-model="transferForm.price"
            :precision="2"
            :step="100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmTransfer"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus, Stamp, Sell } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索表单
const searchForm = reactive({
  name: "",
  type: "",
  createTime: [],
});

// 藏品列表
const collectionList = ref([
  {
    id: "NFT001",
    name: "数字艺术品1",
    type: "original",
    price: 5000,
    createTime: "2023-06-15 10:30:45",
    imageUrl: "https://example.com/nft1.jpg",
  },
  {
    id: "NFT002",
    name: "数字艺术品2",
    type: "derivative",
    price: 3500,
    createTime: "2023-06-14 15:45:22",
    imageUrl: "https://example.com/nft2.jpg",
  },
]);

const total = ref(100);
const selectedNFTs = ref([]);

// 新建/编辑藏品对话框
const nftDialogVisible = ref(false);
const isEditMode = ref(false);
const currentNFT = ref({
  name: "",
  type: "original",
  price: 0,
  imageUrl: "",
});

// 授权对话框
const authorizeDialogVisible = ref(false);
const authorizeForm = ref({
  scopes: [],
  duration: [],
});

// 转让对话框
const transferDialogVisible = ref(false);
const transferForm = ref({
  address: "",
  price: 0,
});

// 搜索和筛选
const handleSearch = () => {
  // 实现搜索逻辑
  ElMessage.success("搜索成功");
};

const resetSearch = () => {
  searchForm.name = "";
  searchForm.type = "";
  searchForm.createTime = [];
};

// 选择变化
const handleSelectionChange = (val) => {
  selectedNFTs.value = val;
};

// 新建藏品
const openCreateNFTDialog = () => {
  isEditMode.value = false;
  currentNFT.value = {
    name: "",
    type: "original",
    price: 0,
    imageUrl: "",
  };
  nftDialogVisible.value = true;
};

// 编辑藏品
const editNFT = (nft) => {
  isEditMode.value = true;
  currentNFT.value = { ...nft };
  nftDialogVisible.value = true;
};

// 确认新建/编辑藏品
const confirmNFT = () => {
  if (!currentNFT.value.name) {
    ElMessage.error("请输入藏品名称");
    return;
  }

  if (isEditMode.value) {
    // 更新逻辑
    const index = collectionList.value.findIndex(
      (item) => item.id === currentNFT.value.id
    );
    collectionList.value[index] = { ...currentNFT.value };
    ElMessage.success("更新成功");
  } else {
    // 新建逻辑
    collectionList.value.push({
      ...currentNFT.value,
      id: `NFT${collectionList.value.length + 1}`,
      createTime: new Date().toLocaleString(),
    });
    ElMessage.success("新建成功");
  }

  nftDialogVisible.value = false;
};

// 查看详情
const viewNFTDetails = (nft) => {
  ElMessageBox.alert(
    `藏品ID: ${nft.id}<br/>
    名称: ${nft.name}<br/>
    类型: ${nft.type === "original" ? "原创" : "衍生"}<br/>
    价格: ￥${nft.price}<br/>
    创建时间: ${nft.createTime}`,
    "藏品详情",
    { dangerouslyUseHTMLString: true }
  );
};

// 授权
const authorizeNFT = (nft) => {
  authorizeDialogVisible.value = true;
  // 可以预填一些信息
};

// 确认授权
const confirmAuthorize = () => {
  ElMessage.success("授权成功");
  authorizeDialogVisible.value = false;
};

// 批量授权
const batchAuthorize = () => {
  if (selectedNFTs.value.length === 0) {
    ElMessage.warning("请选择要授权的藏品");
    return;
  }
  authorizeDialogVisible.value = true;
};

// 转让
const transferNFT = (nft) => {
  transferDialogVisible.value = true;
  transferForm.value.price = nft.price;
};

// 确认转让
const confirmTransfer = () => {
  ElMessage.success("转让成功");
  transferDialogVisible.value = false;
};

// 批量转让
const batchTransfer = () => {
  if (selectedNFTs.value.length === 0) {
    ElMessage.warning("请选择要转让的藏品");
    return;
  }
  transferDialogVisible.value = true;
};

// 删除藏品
const deleteNFT = (nft) => {
  ElMessageBox.confirm(`确定要删除藏品 ${nft.name} 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      collectionList.value = collectionList.value.filter(
        (item) => item.id !== nft.id
      );
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 分页处理
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};

// 图片上传
const handleImageUploadSuccess = (response, uploadFile) => {
  currentNFT.value.imageUrl = URL.createObjectURL(uploadFile.raw);
};
</script>

<style lang="less" scoped>
.admin-collection {
  .search-filter {
    margin-bottom: 20px;
  }

  .operation-buttons {
    margin-bottom: 20px;
  }

  .image-uploader {
    .avatar {
      width: 200px;
      height: 200px;
      display: block;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      text-align: center;
      line-height: 200px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.3s;

      &:hover {
        border-color: @primary-color;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
