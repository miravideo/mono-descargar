<template>
  <div class="mono-dsg-btn" :id="id" :mono-dsg-id="item.id" :style="transform"
    :offsetx="(itm.position ? itm.position.x : 0)" :offsety="(itm.position ? itm.position.y : 0)">
    <div class="mono-dsg-btn-bg" @click="download">
      <div class="mono-dsg-btn-inner" :status="itm.status">
        <svg class="mono-dsg-icon mono-dsg-icon-init" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="6" stroke-linecap="butt" stroke-linejoin="miter"><path d="M24.008 41.99a.01.01 0 0 1-.016 0l-9.978-11.974A.01.01 0 0 1 14.02 30H33.98a.01.01 0 0 1 .007.016l-9.978 11.975Z"></path><path d="M24 42 14 30h20L24 42Z" fill="currentColor" stroke="none"></path><path d="M22 6h4v26h-4z"></path><path fill="currentColor" stroke="none" d="M22 6h4v26h-4z"></path></svg>
        <svg class="mono-dsg-icon mono-dsg-icon-done" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg class="mono-dsg-icon mono-dsg-icon-failed" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 9h2v21h-2z"></path><path fill="currentColor" stroke="none" d="M23 9h2v21h-2z"></path><path d="M23 37h2v2h-2z"></path><path fill="currentColor" stroke="none" d="M23 37h2v2h-2z"></path></svg>
        <div class="mono-dsg-icon mono-dsg-icon-loading">
          <div class="mono-dsg-icon-prg">{{progress}}</div>
          <div class="mono-dsg-icon-wave" :style="{'--progress': `${80 + i*5 - progress*1.3}%`}"
              v-for="(_, i) in new Array(waves)" :key="i"></div>
        </div>
        <span class="mono-dsg-label">{{status}}</span>
      </div>
    </div>
  </div>
</template>
<script>
const md5 = require('blueimp-md5');
const STATUS = {
  init: "下载", loading: "下载中", done: "已完成", failed: "已取消"
}
export default {
  props: ['item'],
  data: function() {
    return {
      waves: 2,
      itm: this.item,
      id: `mono-dsg-${md5(this.item.id)}`,
    }
  },
  mounted: function() {
    this.$set(this.itm, 'status', 'init');
    this.$set(this.itm, 'progress', 0);
    this.$set(this.itm, 'position', { 
      x: this.itm.position?.x || 0, 
      y: this.itm.position?.y || 0
    });
  },
  watch: {
  },
  computed: {
    transform: function() {
      if (!this.itm.position?.x && !this.itm.position?.y) return '';
      return `transform: translate3d(${this.itm.position.x}px, ${this.itm.position.y}px, 0px) scale(1);`;
    },
    status: function () {
      return STATUS[this.itm.status];
    },
    progress: function () {
      return Math.round(Math.min(this.itm.progress * 100, 99));
    }
  },
  methods: {
    remove: function() {
      console.log('remove!');
    },
    download: function(e) {
      e.preventDefault();
      const btn = e.target.parentNode;
      if ((btn.getAttribute('hasMove') || 0) > 0) return false;
      if (this.itm.status === 'loading') return false;
      this.itm.status = 'loading';
      this.$emit('download', this.itm);
      // this.moke();
      return false;
    },
    moke: function() {
      const moke = () => {
        this.itm.progress += 0.01;
        if (this.itm.progress > 1) return this.itm.status = 'done';
        setTimeout(moke, 100);
      }
      if (this.itm.progress > 1) this.itm.progress = 0;
      moke();
    }
  }
}
</script>
<style lang="less" scoped>
@ani: 1s;
@trans: 0.3s;
@size: 42px;
@hsize: 100px; // hover width
@isize: @size - 16px; // icon size
@wsize: @isize; // wave size
@border: 4px;

@bg-whit: #FFF;
@bg-blue: #165DFF;
@bg-dark: #0900A9;
@bg-gren: #08D64D;
@bg-red:  #F53F3F;
@bg-wave: replace(@bg-dark, "#", "");

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

.mono-dsg-btn {
  top: 0px!important;
  right: 0px!important;
  margin: 10px!important;
  padding: 0px!important;
  position: absolute!important;
  z-index: 9999999!important;

  .mono-dsg-btn-bg {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    transform: scale(1.0);
    pointer-events: auto!important;
    box-shadow: 0px 0px 5px #666!important;
    box-sizing: border-box!important;
    min-width: @size !important;
    margin: 0px!important;
    padding: @border!important;
    border-radius: @size*0.5!important;
    border: 0px!important;
    cursor: pointer!important;
    width: @size!important;
    height: @size!important;
    line-height: 28px!important;
    word-spacing: 0!important;
    background: @bg-whit;
    color: @bg-whit;
    opacity: 0.9;
    font-smooth: auto;
    -webkit-font-smoothing: auto;
    transition-property: width color opacity;
    transition-duration: @trans;

    .bg-rad {
      content: "";
      display: block;
      position: absolute;
      width: @size*0.8;
      height: @size*0.7;
      border-radius: 50%!important;
      margin: 1px;
      z-index: 1;
    }

    &:hover {
      opacity: 1.0;
      width: @hsize!important;
      color: #FFF;
      transition-property: width color opacity;
      transition-duration: @trans;

      & .mono-dsg-label {
        width: @hsize - @size - @border;
        opacity: 1;
        transition-property: width opacity margin-left;
        transition-duration: @trans;
      }
    }

    .mono-dsg-label {
      width: 0px;
      text-align: center;
      font-size: 13px;
      white-space: nowrap;
      margin-left: 0px;
      opacity: 0;
      transition-property: width opacity margin-left;
      transition-duration: @trans;
      z-index: 3;
    }

    .mono-dsg-btn-inner {
      pointer-events: none!important;
      background-color: @bg-blue;
      border-radius: (@size - @border * 2)*0.43!important;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      overflow: hidden!important;

      .mono-dsg-icon {
        flex-shrink: 0;
        display: none;
        width: @isize!important;
      }

      .mono-dsg-icon-loading {
        position: relative;
        font-size: 15px;
        width: @isize;
        height: @isize;

        &:after {
          content: "%";
          display: block;
          position: absolute;
          color: rgba(255, 255, 255, 0.75);
          font-size: 12px;
          top: @border;
          left: @isize - 9px;
          transform: scale(0.9);
        }

        .mono-dsg-icon-prg {
          position: absolute;
          z-index: 2;
          width: @isize;
          height: @isize;
          margin-top: -1px;
        }

        .mono-dsg-icon-wave {
          --progress: 100%;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23@{bg-wave}'/%3E%3C/svg%3E");
          background-size: @wsize*6 @wsize;
          background-position: 50% 50%;
          background-repeat: repeat-x;
          position: absolute;
          width: 1500%;
          height: 100%;
          transform: translate3d(0, 0, 0);
          opacity: 0.5;
          margin-top: -@border;
          top: var(--progress);
          // transform: translateX(-10%);
          animation: wave 1s linear infinite;

          &:after {
            content: "";
            position: absolute;
            display: block;
            background-color: @bg-dark;
            top: @isize - (@isize - @wsize*0.6)*0.5;
            width: 100%;
            height: 100%;
          }
        }

        .mono-dsg-icon-wave:nth-of-type(2) {
          // transform: translateX(-50%);
          animation: wave 1.3s reverse linear infinite;
        }

        .mono-dsg-icon-wave:nth-of-type(3) {
          // transform: translateX(-50%);
          animation: wave 1.5s linear infinite;
        }

        @keyframes wave {
          0% {transform: translateX(-10%);}
          50% {transform: translateX(-30%);}
          100% {transform: translateX(-50%);}
        }
      }

      &[status="init"] > .mono-dsg-icon-init { display: block }
      &[status="loading"] > .mono-dsg-icon-loading { display: block }

      &[status="done"] {
        background-color: @bg-gren;
        transition-property: background-color;
        transition-duration: @trans;

        & > .mono-dsg-icon-done {
          display: block;
        }
      } 

      &[status="failed"] {
        background-color: @bg-red;
        transition-property: background-color;
        transition-duration: @trans;

        & > .mono-dsg-icon-failed {
          display: block;
        }
      } 
    }
  }
}
</style>