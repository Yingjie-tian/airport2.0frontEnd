export const selectTime = function (timeData, stimeData, dtimeData) {
  // 计算每一条数据时间大小-化为秒
  let timeStr = timeData.substring(11, 19);
  let hour = parseInt(timeStr.substring(0, 2));
  let min = parseInt(timeStr.substring(3, 5));
  let sec = parseInt(timeStr.substring(6, 8));
  let time = hour * 60 * 60 + min * 60 + sec;


  let stime_hour = parseInt(
    stimeData.substring(0, 2)
  );
  let stime_min = parseInt(
    stimeData.substring(3, 5)
  );
  let stime = stime_hour * 60 * 60 + stime_min * 60;

  let dtime_hour = parseInt(
    dtimeData.substring(0, 2)
  );
  let dtime_min = parseInt(
    dtimeData.substring(3, 5)
  );
  let dtime = dtime_hour * 60 * 60 + dtime_min * 60;

  if (time >= stime & time <= dtime) {
    return true
  }
}

// 计算当前时间
export const getNewtime = function () {
  // 计算当前日期，并转化为2020/3/4的形式
  let time = new Date();
  let year = time.getFullYear();
  let mouth = time.getMonth() + 1;
  let day = time.getDate();
  let date = `${year}/${mouth}/${day}`;
  return date;
}

// 计算最小最大日期
export const getMinMaxDate = function (arr) {
  let min = arr[0]
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (min > arr[i]) {
      min = arr[i]
    }
    if(max<arr[i]){
      max = arr[i]
    }
  }
  let timeArr = []
  timeArr.push(min)
  timeArr.push(max)
  return timeArr
}

// 计算当前时间-tyj
const getNowtime = function () {
  // 计算当前日期，并转化为2020/3/4的形式
  let time = new Date();
  let year = time.getFullYear();
  let mouth = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
  let day = time.getDate() < 10 ? '0' + (time.getDate()) : time.getDate();
  let hour = time.getHours() < 10 ? '0' + (time.getHours()) : time.getHours();
  let min = time.getMinutes() < 10 ? '0' + (time.getMinutes()) : time.getMinutes();
  let sec = time.getSeconds() < 10 ? '0' + (time.getSeconds()) : time.getSeconds();
  let date = `${year}-${mouth}-${day} ${hour}:${min}:${sec}`;
  return date;
}

// 计算当前时间
export const getNewtime2 = function () {
    // 计算当前日期，并转化为yyyy-MM-dd HH:mm:ss的形式
  //   let time = new Date();
  //   let year = time.getFullYear();
  //   let mouth = time.getMonth() + 1;
  //   let day = time.getDate();
  //   let hour=time.getHours()< 10 ? "0" + time.getHours() : time.getHours();
  //   let min=time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  //   let sec=time.getSeconds()< 10 ? "0" + time.getSeconds() : time.getSeconds();
  //   let date = `${year}-${mouth}-${day} ${hour}:${min}:${sec}`;
  //   return date;

    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

            + " " + date.getHours() + seperator2 + date.getMinutes()

            + seperator2 + date.getSeconds();
    return currentdate;
  }

export default getNowtime
