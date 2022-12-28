const saveByteArray = (res, fileName) => {
    var blob = new Blob([res.data], {

        type: res.headers["content-type"],

      })

      const link = document.createElement("a")

      link.href = window.URL.createObjectURL(blob)

      link.download = `${fileName}.xlsx`

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

const saveByteArrayV2 = (reportName, byte) => {
    var sampleArr = base64ToArrayBuffer(byte);
    saveByteArray(reportName, sampleArr);
}

const saveByteArrayV3 = resultByte => {
    var bytes = new Uint8Array(resultByte); // pass your byte response to this constructor

    var blob=new Blob([bytes], {type: "application/vnd.ms-excel"});// change resultByte to bytes
    
    var link=document.createElement('a');
    link.href=window.URL.createObjectURL(blob);
    link.download="myFileName";
    link.click();
}


export default {
    saveByteArray,
    saveByteArrayV2,
    saveByteArrayV3
}