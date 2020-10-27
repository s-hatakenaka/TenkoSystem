export default {

    seisansyaMaster: "http://20.46.113.8:81/api/SeisansyaMaster",
    syouhinMaster: "http://20.46.113.8:1025/api/SyohinMaster",
    shijoMaster: "http://20.46.113.8:1026/api/ShijyoMaster",
    chikuMaster: "http://20.46.113.8:1027/api/ChikuMaster",
    shisyoMaster: "http://20.46.113.8:1028/api/ShisyoMaster",
    meisyoMaster: "http://20.46.113.8:1029/api/MeisyoMaster",
    hosoMaster: "http://20.46.113.8:1030/api/HosoMaster",
    tankaMaster: "http://20.46.113.8:1031/api/TankaMaster",
    unchinMaster: "http://20.46.113.8:1032/api/UnchinMaster",
    shizaiKanriMaster: "http://20.46.113.8:1033/api/ShizaiKanriMaster",
    shizaiMaster: "http://20.46.113.8:1034/api/ShizaiMaster",
    shizaiHachusyoMaster: "http://20.46.113.8:1035/api/ShizaiHacyusyoMaster",
    syogakariMaster: "http://20.46.113.8:1036/api/SyogakariMaster",
    tantoMaster: "http://20.46.113.8:1039/api/TantoMaster",
    henpinRiyuMaster: "http://20.46.113.8:1049/api/MeisyoHenpinRiyuMaster",
    bikouMaster: "http://20.46.113.8:1048/api/MeisyoBikoMaster",
    bumonMaster: "http://20.46.113.8:1056/api/BumonMaster",


    syohinShijyoTokyuPatternMaster: "http://20.46.113.8:1051/api/SyohinShijyoTokyuPatternMaster",
    syohinKumiaiTokyuPatternMaster: "http://20.46.113.8:1052/api/SyohinKumiaiTokyuPatternMaster",

    tokyuMaster: "http://20.46.113.8:1042/api/TokyuMaster",
    syohinHinsyuTokyuPatternMaster: "http://20.46.113.8:1041/api/SyohinHinsyuTokyuPatternMaster",
    syohinSizeTokyuPatternMaster: "http://20.46.113.8:1038/api/SyohinSizeTokyuPatternMaster",
    syohinSizeTokyuPatternMasterNiuke:"http://20.46.113.8:1050/api/SyohinSizeTokyuPatternMasterNiuke",
    SyohinHinsyuHosoPatternMaster: "http://20.46.113.8:1037/api/SyohinHinsyuHosoPatternMaster",

    syohinSizeMaster:"http://20.46.113.8:1053/api/SyohinSizeMaster",
    syohinHinsyuMaster:"http://20.46.113.8:1054/api/SyohinHinsyuMaster",
    syohinHosoMaster:"http://20.46.113.8:1055/api/SyohinHosoMaster",

    tankaSyusei: "http://20.46.113.8:5003/api/Tankasyusei",
    sizeWaritukeMaster: "http://20.46.113.8:1040/api/SizewaritukeMaster",
    niukeMonitorList: "http://20.46.113.8:5008/api/NiukeMonitaRisuto",
    syukkayoteinyuryoku: "http://20.46.113.8:5009/api/Syukkayoteinyuryoku",
    zaikohyoji: "http://20.46.113.8:5026/api/Zaikohyoji",

    niukeNyuryokuKensaku: "http://20.46.113.8:5013/api/NiukenyuryokuKensaku",
    niukeNyuryoku: "http://20.46.113.8:5001/api/Niukenyuryoku",

    syukkaNyuryoku: "http://20.46.113.8:5004/api/Syukkadenpyo",
    syukkaNyuryokuKensaku: "http://20.46.113.8:5016/api/SyukkaDenpyoKensaku",
    syukkaKakutei: "http://20.46.113.8:5007/api/SyukkaKakuteiSyori",
    syukkaKakuteiSyori_SyukkaDenpyo: "http://20.46.113.8:5023/api/SyukkaKakuteiSyori_SyukkaDenpyo",
    syukkaKakuteiSyori_SyukkaShijisyo:"http://20.46.113.8:5024/api/SyukkaKakuteiSyori_SyukkaShijisyo",
    syukkaKakuteiSyori_SyukkaNikkeihyo:"http://20.46.113.8:5025/api/SyukkaKakuteiSyori_SyukkaNikkeihyo",


    kensaNyuryokuShinkoku: "http://20.46.113.8:5012/api/KensanyuryokuSinkoku",
    kensaNyuryoku: "http://20.46.113.8:5010/api/Kensanyuryoku",



    niukeZissekiHyou: {
        kaisu: "http://20.46.113.8:5011/api/Niukezissekihyo_kaisu",
        dozitsuZennenhi: "http://20.46.113.8:5014/api/Niukezissekihyo_yearonyeardata",
        nikkeiHikaku: "http://20.46.113.8:5015/api/Niukezissekihyo_nikkeihikaku",
        ruikeiHikaku: "http://20.46.113.8:5022/api/Niukezissekihyo_Ruikeihikaku",
    },



    createGetUrl: function (getUrl, postArray) {

        var url = getUrl;

        for (var i = 0; i < postArray.length; i++) {

            var key = postArray[i].key;
            var value = postArray[i].value;


            if (i == 0) {
                url += "?" + key + "=" + value;
            } else {
                url += "&" + key + "=" + value;
            }

        }

        return url;


    }
}