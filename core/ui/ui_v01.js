var $UI = $UI || {};

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