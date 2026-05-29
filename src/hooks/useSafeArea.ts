import { ref, onMounted } from 'vue';

export interface SafeAreaInfo {
  statusBarHeight: number;
  capsuleTop: number;
  capsuleHeight: number;
  capsuleBottom: number;
  capsuleLeft: number;
  headerHeight: number;
  isWeChat: boolean;
}

export function useSafeArea() {
  const info = ref<SafeAreaInfo>({
    statusBarHeight: 20,
    capsuleTop: 24,
    capsuleHeight: 32,
    capsuleBottom: 56,
    capsuleLeft: 280,
    headerHeight: 64,
    isWeChat: false
  });

  const initSafeArea = () => {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 20;
      let capsuleTop = statusBarHeight + 4;
      let capsuleHeight = 32;
      let capsuleBottom = statusBarHeight + 36;
      let capsuleLeft = sysInfo.windowWidth - 96;
      let isWeChat = false;

      // #ifdef MP-WEIXIN
      isWeChat = true;
      if (uni.getMenuButtonBoundingClientRect) {
        const menuButton = uni.getMenuButtonBoundingClientRect();
        if (menuButton) {
          capsuleTop = menuButton.top;
          capsuleHeight = menuButton.height;
          capsuleBottom = menuButton.bottom;
          capsuleLeft = menuButton.left;
        }
      }
      // #endif

      // Header height is calculated to center align with WeChat's capsule button
      const headerHeight = capsuleBottom + 6;

      info.value = {
        statusBarHeight,
        capsuleTop,
        capsuleHeight,
        capsuleBottom,
        capsuleLeft,
        headerHeight,
        isWeChat
      };
    } catch (e) {
      console.error('Failed to get safe area info:', e);
    }
  };

  // Run immediately and on mount
  initSafeArea();

  return {
    safeArea: info
  };
}
