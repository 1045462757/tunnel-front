//全局Api接口

//本地测试
const http = "http://127.0.0.1:8090";

//生产环境
// const http = "https://hylovecode.cn:8090"

const globalAPI = {

    /**
     * tunnel
     */
    //post
    InsertTunnelApi: http + "/tunnel",

    //delete
    DeleteTunnelApi: http + "/tunnel",

    //modify
    ModifyTunnelApi: http + "/tunnel",

    //get
    GetTunnelApi: http + "/tunnel",

    //get
    ListTunnelApi: http + "/tunnels",

    //get
    ListIdAndName: http + "/tunnelList",

    /**
     * monp
     */
    //post
    InsertMonpApi: http + '/monp',

    //delete
    DeleteMonpApi: http + "/monp",

    //modify
    ModifyMonpApi: http + "/monp",

    //get
    GetMonpApi: http + "/monp",

    //get
    ListMonpApi: http + "/monps",

    //get
    ListIdAndNameForMonp: http + "/monpList",

    /**
     * monpData
     */
    //get
    ListMonpDataApi: http + '/monpDataList',
}

export default globalAPI