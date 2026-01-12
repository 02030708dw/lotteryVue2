<template>
    <div class="gr_wallet-list">
        <HeaderNav />
        <div>
            <Navigation />
            <Controllers />
            <WalletList />
        </div>
    </div>
</template>
<script>
import HeaderNav from '@C/HeaderNav'
import Navigation from './Navigation'
import Controllers from './Controllers'
import WalletList from './WalletList'

export default {
    name: 'Wallet',
    components: {
        HeaderNav,
        Navigation,
        Controllers,
        WalletList
    }
}
</script>
