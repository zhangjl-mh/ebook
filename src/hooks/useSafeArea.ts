import { ref } from 'vue';

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
  const safeArea = ref<SafeAreaInfo>({
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
      const systemInfo = uni.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      let capsuleTop = statusBarHeight + 4;
      let capsuleHeight = 32;
      let capsuleBottom = statusBarHeight + 36;
      let capsuleLeft = systemInfo.windowWidth - 96;
      let isWeChat = false;

      // #ifdef MP-WEIXIN
      isWeChat = true;
      const menuButton = uni.getMenuButtonBoundingClientRect?.();

      if (menuButton) {
        capsuleTop = menuButton.top;
        capsuleHeight = menuButton.height;
        capsuleBottom = menuButton.bottom;
        capsuleLeft = menuButton.left;
      }
      // #endif

      safeArea.value = {
        statusBarHeight,
        capsuleTop,
        capsuleHeight,
        capsuleBottom,
        capsuleLeft,
        headerHeight: capsuleBottom + 6,
        isWeChat
      };
    } catch (error) {
      console.error('Failed to get safe area info:', error);
    }
  };

  initSafeArea();

  return { safeArea };
}
