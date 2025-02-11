import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListStore = defineStore('list', () => {
  // 首页轮播图
  const banners = ref([])
  const bannersLoading = ref(false)

  // 首页最新作品
  const latestWorks = ref([])
  const latestWorksLoading = ref(false)

  // 首页最新NFT
  const latestNfts = ref([])
  const latestNftsLoading = ref(false)

  // 作品列表
  const works = ref([])
  const worksTotal = ref(0)
  const worksLoading = ref(false)

  // NFT列表
  const nfts = ref([]) 
  const nftsTotal = ref(0)
  const nftsLoading = ref(false)

  return {
    banners,
    bannersLoading,
    latestWorks,
    latestWorksLoading,
    latestNfts,
    latestNftsLoading,
    works,
    worksTotal,
    worksLoading,
    nfts,
    nftsTotal,
    nftsLoading
  }
}) 