const notifier = {};
$(() =>{
    //attach event to the loading box - show loading box every time when send request to the DB/Loading on
    let loadingBox = $("#loadingBox");
    let loading = 0;
    $(document).on({
        ajaxStart: () => {
            if(!loading)loadingBox.fadeIn();
            loading++;
        },
        ajaxStop: () => {
            setTimeout(()=>{ if (loading) loadingBox.fadeOut();
                loading--;}, 400)
        }
    })

    notifier.showInfo = function (message) {
        let infoBox = $('#infoBox');
        infoBox.click(()=> infoBox.fadeOut());
        infoBox.find('span').text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    notifier.showError = function (message) {
        let errorBox = $('#errorBox');
        errorBox.click(()=>{errorBox.fadeOut()});
        errorBox.find('span').text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 10000);
    }

    notifier.handleError = function (err) {
        let message ='Error: ';
        if(err){
            if(err.responseJSON){
                message += err.responseJSON.description;
            }else{
                message += err.message;
            }
            notifier.showError(message)
        }
    }
});
