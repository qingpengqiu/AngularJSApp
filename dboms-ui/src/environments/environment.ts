// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const dbomsPath = '/';

//net
export const environment = {
  debounceTime:500,
  production: false,
  // server:'http://10.0.1.26:88/api/'
  server:'/api/'
};

export const environment_java ={
  debounceTime:500,
  production: false,
  server:'/dbomsapi/'
}

//选人
export const PersonAPIConfig = {
	searchUrlPattern:environment_java.server+"persons"
}

//
export const dbomsUiWebSetting = {
  webUiServer: "http://10.0.1.26:666"
}
