import ajax from "./axios";

//请求基本信息
const BASE_URL='http://localhost:8866';

// *****************************************************************************
// 航班数据
// 根据用户名查询测试数据---陈亚坤
export const selectTestDataName = (data)=>ajax(BASE_URL+`/test-flight/getFilename`,"POST",data)
// 根据用户名和测试数据文件名查询数据
export const selectTestData = (data)=>ajax(BASE_URL+`/test-flight/getFlightInfoByFilename`,"POST",data)
// 查询机场名称
export const selectAirportName = ()=>ajax(BASE_URL+`/flight-info/selectAirportName`,"GET")
// 查询机场数据
export const selectAirportData = (data)=>ajax(BASE_URL+`/flight-info/getFlightInfoByAirportname`,"POST",data)
// 保存测试数据
export const insertAirportData = (data)=>ajax(BASE_URL+`/test-flight/insert`,"POST",data)
// export const insertManualData = (data)=>ajax(BASE_URL+`/manual-result/insert`,"POST",data)
// 删除测试数据
export const deleteTestData = (data)=>ajax(BASE_URL+`/test-flight/deleteByFilename`,"POST",data)
// export const deleteManualData = (data)=>ajax(BASE_URL+`/manual-result/deleteResultByFilename`,"POST",data)
//保存航班上传数据
export const saveAirportData = (data)=>ajax(BASE_URL+`/flight-info/insert`,"POST",data)
// 保存测试数据到结果表
export const saveResultData = (data)=>ajax(BASE_URL+`/flight-info/insertResult`,"POST",data)

// *****************************************************************************
// 航班任务优先级配置---陈亚坤
//根据机场名称和用户名查询航班任务优先级配置数据
export const selectFlightPriorityData = (data)=>ajax(BASE_URL+`/flight-priority/selectPriorityByAirportname`,"POST",data)
//根据id修改排序规则
export const updateRuleById = (data)=>ajax(BASE_URL+`/flight-priority/updateSortRule`,"POST",data)
// 根据机场名称和用户名删除航班任务优先级配置数据
export const deleteFlightPriorityData = (data)=>ajax(BASE_URL+`/flight-priority/deleteByAirportName`,"POST",data)
// 插入航班优先级数据
export const insertFlightPriorityData = (data)=>ajax(BASE_URL+`/flight-priority/insert`,"POST",data)

// *****************************************************************************
// 机位优先级优先级配置---陈亚坤
// 根据机场名称和用户名查询航班类型数据
export const selectTypes = (data)=>ajax(BASE_URL+`/parkinggate-priority/selectType`,"POST",data)
// 根据用户名、机场名称、航班类型查询数据
export const selectByAirportnameAndUserIdAndType = (data)=>ajax(BASE_URL+`/parkinggate-priority/selectByAirportnameAndUserIdAndType`,"POST",data)
// 根据机场名称查询机位号
export const selectParkinggate = (data)=>ajax(BASE_URL+`/parkinggate-priority/selectParkinggate`,"POST",data)
// 根据groupid、航班类型、机场名称、用户名删除数据
export const deleteParkinggate = (data)=>ajax(BASE_URL+`/parkinggate-priority/deleteParkinggate`,"POST",data)
// 根据航班类型、机场名称、用户名删除数据
export const deleteByType = (data)=>ajax(BASE_URL+`/parkinggate-priority/deleteByType`,"POST",data)
// 插入数据
export const insertData = (data)=>ajax(BASE_URL+`/parkinggate-priority/insert`,"POST",data)



// *****************************************************************************
// 同区域滑入推出限制表IOAREA_CONFLICT---田英杰
// 滑入推出限制###################
// 根据机场名称查询区域限停机位数据  
export const getByInputName = (data)=> ajax(BASE_URL+`/ioarea-conflict/getInfoByAN`,"POST",data)

// 根据id删除机场区域限停机位数据
export const deleteArea = (data)=> ajax(BASE_URL+`/ioarea-conflict/deleteArea`,"POST",data)

// 根据机场名称获取有几个区域 
export const getAreaid = (data)=> ajax(BASE_URL+`/ioarea-conflict/getAreaid`,"POST",data)

// 根据机场名称和区域编号获取区域内有几个停机位
export const getParkinggate = (data)=> ajax(BASE_URL+`/ioarea-conflict/getParkinggate`,"POST",data)

// 插入新的机场区域机位限停约束--新建
export const insertinfo = (data)=> ajax(BASE_URL+`/ioarea-conflict/insert`,"POST",data)

// 根据数据id更改机场区域限停区域和机位号
export const updateLimitInfoById = (data)=> ajax(BASE_URL+`/ioarea-conflict/updateLimitInfo`,"POST",data)

// 批量删除机场区域限停机位信息
export const batchDelete = (data)=> ajax(BASE_URL + '/ioarea-conflict/batchDelete',"POST",data)
// 滑入推出限制###################

// ------------------分割线--------------------------------

// 机位机型限制#########################
// 根据机场名称查询区域限停机位数据  
export const getStandAirTypeByAN = (data)=> ajax(BASE_URL+`/parking-mdl/getInfoByAN`,"POST",data)

// 插入机位机型数据
export const insterStandAirType = (data)=> ajax(BASE_URL+`/parking-mdl/insterNewInfo`,"POST",data)

// 删除机位机型数据
export const batchDeleteStandAirType = (data)=> ajax(BASE_URL+`/parking-mdl/batchDeleteInfo`,"POST",data)

// 修改机位机型数据
export const updateStandAirType = (data)=> ajax(BASE_URL+`/parking-mdl/updateInfo`,"POST",data)
// 机位机型限制#########################

// ------------------分割线--------------------------------

// 航司机位限制################
// 获取航司机位限制信息
export const getairlineLimit = (data)=> ajax(BASE_URL+`/airline_limit/selectAirlineLimit`,"POST",data)
// 插入航司机位限制信息
export const insertAirlineLimit = (data)=> ajax(BASE_URL+`/airline_limit/insert`,"POST",data)
// 修改航司机位限制信息
export const updateAirlineLimit = (data)=> ajax(BASE_URL+`/airline_limit/updateInfo`,"POST",data)
// 删除航司机位限制信息
export const deleteAirlineLimit = (data)=> ajax(BASE_URL+`/airline_limit/batchDelete`,"POST",data)

// 航司机位限制################

// ------------------分割线--------------------------------

// 航司靠桥率限制################
// 获取靠桥率限制信息
export const getBridgeRate = (data)=> ajax(BASE_URL+`/airline_bridgeRate/getBridgeRate`,"POST",data)
// 插入靠桥率限制信息
export const insertBridgeRate = (data)=> ajax(BASE_URL+`/airline_bridgeRate/insert`,"POST",data)
// 修改靠桥率限制信息
export const updateBridgeRate = (data)=> ajax(BASE_URL+`/airline_bridgeRate/updateInfo`,"POST",data)
// 删除靠桥率限制信息
export const deleteBridgeRate = (data)=> ajax(BASE_URL+`/airline_bridgeRate/batchDelete`,"POST",data)

// 航司靠桥率限制################

// ------------------分割线--------------------------------

// 时间参数设置################
// 获取时间参数
export const getTimeParameter = (data)=> ajax(BASE_URL+`/time_parameter/getTimeParameter`,"POST",data)
// 插入时间参数信息
export const insertTimeParameter = (data)=> ajax(BASE_URL+`/time_parameter/insert`,"POST",data)
// 修改时间参数信息
export const updateTimeParameter = (data)=> ajax(BASE_URL+`/time_parameter/updateInfo`,"POST",data)
// 删除时间参数配置
export const deleteTimeParameter = (data)=> ajax(BASE_URL+`/time_parameter/batchDelete`,"POST",data)
// 时间参数设置################


// *****************************************************************************
// 机位数据
// 根据机场名称查询机位数据---吴卓霖
export const selectGateData = (data)=>ajax(BASE_URL+`/gate-info/getGateInfoByAirportname`,"POST",data)
// 保存机位表单数据
export const insertGateData = (data)=>ajax(BASE_URL+`/gate-info/insert`,"POST",data)
// 更新机位表单数据
export const updateGateData = (data)=>ajax(BASE_URL+`/gate-info/update2`,"POST",data)
// 删除机位表单数据
export const deleteGateData = (data)=>ajax(BASE_URL+`/gate-info/delete`,"POST",data)
