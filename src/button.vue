<template>
  <div :id="id" class="mono-dsg-container">
    <div class="mono-dsg-btn" @click="download" :style="transform"
      :offsetx="itm.position.x" :offsety="itm.position.y" >
    {{itm.progress}}
    </div>
  </div>
</template>
<script>
const md5 = require('blueimp-md5');
export default {
  props: ['item'],
  data: function() {
    return {
      itm: this.item,
      id: `mono-dsg-${md5(this.item.id)}`,
    }
  },
  mounted: function() {
    this.$set(this.itm, 'progress', 0);
    console.log('mounted');
  },
  watch: {
  },
  computed: {
    transform: function() {
      return `transform: translate3d(${this.itm.position.x}px, ${this.itm.position.y}px, 0px) scale(1);`;
    }
  },
  methods: {
    remove: function() {
      console.log('remove!');
    },
    download: function(e) {
      if (e.target?.getAttribute('hasMove') || 0 > 0) return;
      this.$emit('download', this.itm);
    }
  }
}
</script>
<style lang="less" scoped>
*:focus {
  outline: 0 !important;
}

* {
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  font-weight: 380;
  font-family: Noto Sans,Helvetica Neue,Helvetica,PingFang SC!important;
}

.mono-dsg-container {
  position: relative;
  max-width: 100%;
  width: 100%;
  height: 100%;
  pointer-events: none!important;
}

.mono-dsg-btn {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  transform: scale(1.0);
  pointer-events: auto!important;
  box-shadow: 0px 0px 5px #666!important;
  box-sizing: border-box!important;
  position: absolute!important;
  min-width: 32px !important;
  top: -100%!important;
  right: 0px!important;
  margin: 10px!important;
  z-index: 9999999!important;
  border-radius: 18px;
  border: 2px solid #EEE!important;
  cursor: pointer!important;
  width: 32px!important;
  height: 32px!important;
  line-height: 28px!important;
  word-spacing: 0!important;
  background: rgba(0,0,0,0.6);
  color: #EEE;
  opacity: 0.8;
  font-smooth: auto;
  -webkit-font-smoothing: auto;
}
</style>