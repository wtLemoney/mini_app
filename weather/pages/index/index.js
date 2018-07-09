//index.js
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
};
//引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const UNPROMPTED = 0 //未弹窗 unprompted
const UNAUTHORIZED = 1 //已弹窗取消 unauthorized
const AUTHORIZED = 2 //同意 authorized

// const UNPROMPTED_TIPS = "点击获取当前位置"
// const UNAUTHORIZED_TIPS = "点击开启位置权限"
// const AUTHORIZED_TIPS = "" 

Page({ // 小程序刚刚启动时，会调用启动页面的 onLoad() 函数。

  data: {
    nowTemp: '14°',
    nowWeather: '多云',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
    city: '广州市',
    locationAuthType: UNPROMPTED
  },

  onLoad() {// onLoad() 函数会在页面启动时被执行，监听页面加载
    // console.log('onLoad');
    this.qqmapsdk = new QQMapWX({
      key: 'OSQBZ-6I3KG-BU2QV-I7SZI-CGQ2J-UCFBL',
    });
    wx.getSetting({// 获取了当前位置权限
      success: res=>{
        let auth = res.authSetting['scope.userLocation'];
        this.setData({
          locationAuthType : auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        });
        if(auth){
          this.getCityAndWeather();
        }else{
          this.getNow();
        }
      }
    })
    // this.getNow();
  },

  onPullDownRefresh() {//下拉刷新
    this.getNow(() => wx.stopPullDownRefresh()) // 
  },

  
  // onShow(){
  //   console.log('onReady');
  //   wx.getSetting({
  //     success: res=>{
  //       let auth = res.authSetting['scope.userLocation'];
  //       console.log(auth);//为ture，表示打开位置权限
  //       if (auth && this.data.locationAuthType !== AUTHORIZED){
  //         //权限从无到有
  //         this.setData({
  //           locationAuthType: AUTHORIZED,
  //         //  locationTipsText: AUTHORIZED_TIPS
  //         })
  //         this.getCityAndWeather();

  //       } 
  //     }
  //   })
  // },

  getNow(callback){
      wx.request({
        url: 'https://test-miniprogram.com/api/weather/now',
        data: {//data是请求的参数
          city: this.data.city
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res=>{
          // console.log(res);
          let result = res.data.result;
          console.log(result);
          this.setNow(result);
        
          //设置forecast
          this.setHourlyWeather(result);

          this.setToday(result);
          },
          
        complete: () => {
          //wx.stopPullDownRefresh();//结束下拉刷新
          callback && callback();//有回调函数传入就执行
        }
      })
  },

  setNow(result){
    let temp = result.now.temp;
    let weather = result.now.weather;
    console.log(temp, weather);
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({//设置导航栏背景
      frontColor: '#000000', // 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000,必填
      backgroundColor: weatherColorMap[weather],
    })
  },

  setHourlyWeather(result){
    // console.log(result);
    let forecast = result.forecast;
    let nowHour = new Date().getHours();
    let hourlyWeather = [];
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setToday(result){
    let date = new Date();
    this.setData({//`${result.today.minTemp}°-${result.today.maxTemp}°`
      todayTemp: result.today.minTemp+"°-"+result.today.maxTemp+"°",
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },

//进入第二页
  onTapDayWeather(){
    wx.showToast();
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city
    })
  },

//点击获取位置
  onTapLocation(){
    if(this.data.locationAuthType === UNAUTHORIZED){//若点击开启位置权限，打开设置页面
        wx.openSetting({
          success: res=>{
            // console.log(res);
            let auth = res.authSetting['scope.userLocation'];
            if(auth){
              this.getCityAndWeather();
            }
          }
        });
    }else{
      this.getCityAndWeather();
    }
  },

  getCityAndWeather(){
    wx.getLocation({//微信调用位置信息
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED //2
        })
        console.log(res.latitude, res.longitude)//打印经纬度

        this.qqmapsdk.reverseGeocoder({//将经纬度转化为了城市名称的接口
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city;
            console.log(city);
            this.setData({
              city: city
            });
            this.getNow();
          }
        });
      },

      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED, //1
        })
      },
    })
  }


})

