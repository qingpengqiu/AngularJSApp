
// export const environment = {
//   production: true,
//   server:'http://10.0.1.26:88/'
// };

//针对于单点登录
//net
// export const environment = {
//   debounceTime:500,
//   production: true,
//   server:'./../dbomsapi/api/'
// };
// export const environment_java ={
//   debounceTime:500,
//   production: true,
//   server:'./../dboms/dbomsapi/'
// }

export const dbomsPath = '/dboms/';

export const environment = {
  debounceTime:500,
  production: true,
  server:'./api/'
};
export const environment_java ={
  debounceTime:500,
  production: true,
  server:'./dbomsapi/'
}

export const PersonAPIConfig = {
	searchUrlPattern:environment_java.server+"persons"
}

//
export const dbomsUiWebSetting = {
  server: "http://10.0.1.26:666"
}
