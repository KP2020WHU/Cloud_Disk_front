import request from "@/util/request";

// 1获取文件夹列表
function getFileListApi(path) {
    return request({
        url: "./cloudfiles/GetCloudFileList",
        // url: "./data/file-list.json",
        params: { path: path } // param: path
    });
}

// 2新增文件夹
function addFolderApi(path) {
    return request({
        url: "./cloudfiles/MakeDir",
        params: { path: path }
    });
}

// 4获取全部文件夹
function getAllFoldersApi(data) {
    return request({
        url: "./cloudfiles/GetCloudFileListAll",
        data
    });
}

// 6删除文件|文件夹
function delFileApi(path) {
    return request({
        url: "/cloudfiles/DeleteCloudFile",
        params: { path: path }
    });
}

// 8下载数据
function downloadDataApi(filePath) { //TODO 传入文件信息请求下载数据
    return request({
        url: "./cloudfiles/GetFile",
        responseType: "blob",
        params: { filePath: filePath },
    });
}

// 9文件夹移动
function fileMoveApi(sourcePath, destPath) {
    return request({
        // url: "./data/move-file.json",
        url: "./cloudfiles/MoveCloudFile",
        params: {
            sourcePath: sourcePath,
            destPath: destPath
        }
    });
}

function testApi(data) {
    return request({
        method: "POST",
        url: "./cloudfiles/download",
        params: { filePath: "Users/Peng/root/UniOpmClient_Setup for win10.exe" },
        data
    })
}

//? it seems that we don't actually upload our files here
function fileUpload(data) {
    return request({
        method: "POST",
        url: "./cloudfiles/UploadCloudFile",
        data
    })
}

export {
    getFileListApi, // 1获取文件夹列表
    addFolderApi, // 2新增文件夹
    getAllFoldersApi, // 4获取全部文件夹
    delFileApi, // 6删除文件|文件夹
    downloadDataApi, // 8下载数据
    fileMoveApi, // 9文件夹移动
    testApi,
    fileUpload
};