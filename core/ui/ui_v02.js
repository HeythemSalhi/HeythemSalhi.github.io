var $UI = $UI || {};

//LOADING
$UI.drawloading = function () {
    $UI.loading = new $UI.Loading("lyr_loading", { title: 'LOADING 加載中 ...' });
}

$UI.Loading = function (cId,oPars) {
    this.id = cId;
    this.vaule = 0;
    $('#' + cId).append('<div id="' + cId + '_loadbar" class="ui_loadingbar"><div id="' + cId + '_loadbarfill" class="ui_barfill" style="width:0px"></div><div class="ui_text">'+oPars.title+'</div></div>');
}
$UI.Loading.prototype.show = function () { $('#' + this.id).fadeIn("fast"); };
$UI.Loading.prototype.hide = function () { $('#' + this.id).fadeOut("slow"); };
$UI.Loading.prototype.setValue = function (nPor) {
    if (nPor < 0) (nPor = 0);
    if (nPor > 1) (nPor = 1);
    $('#' + this.id + '_loadbarfill').css('width', Math.round(nPor * 670));
    $('#' + this.id + '_background').css('-webkit-filter', 'grayscale(' + (100 - (nPor * 100)) + '%)');
    $('#' + this.id + '_background').css('filter', 'grayscale(' + (100 - (nPor * 100)) + '%)');
};

//MESSAGE FRAME
$UI.Timewindow = function (cId, oPar) {
    this.id = cId;
    var cVal = '';
    cVal = '<div class="portrait"></div><div class="text_time_window"></div>';

    $('body').append('<div id="' + cId + '" class="ui_time_window" style="display:none">' + cVal + '</div>')
};

$UI.Timewindow.prototype.show = function (msg,ch) {
    var id = '#' + this.id;
	if (!ch) {
		ch={"img_face_big":"data/graphics/mr_robot.png"};
	}
	else if (ch == 'visitor') {
		ch={"img_face_big":"data/graphics/visitor.png"};
	}
    $('#' + this.id).css('display', 'block').find('.portrait').css('background', "url('" +$RG.baseDirectory + ch.img_face_big + "') no-repeat").css('background-size','100%');
    $('#' + this.id).find('.text_time_window').text(msg);
    try { clearTimeout(this.time_win); } catch (e) { };
    this.time_win=setTimeout(function () { $(id).css('display', 'none'); }, 3000);
};

$UI.Timewindow.prototype.hide = function () {
    $('#' + this.id).css('display', 'none');
};

//DRAW
$UI.draw = function () {
    $UI.timewindow = new $UI.Timewindow("lyr_timewindow");
}