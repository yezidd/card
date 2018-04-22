/**
 * Created by yzdd on 2018/4/19.
 */
function clearData(data){
  return JSON.parse(JSON.stringify(data));
}
module.exports = {
  clearData
}