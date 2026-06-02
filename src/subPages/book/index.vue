<template>

</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';

type WebviewQuery = Record<string, string | undefined>;


const safeDecode = (value = '') => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

onLoad((query?: WebviewQuery) => {
    const title = safeDecode(query?.title || '详情');
    uni.setNavigationBarTitle({ title });
});
</script>
