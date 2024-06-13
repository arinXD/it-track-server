var rand = function() {
    return Math.random().toString(36).substr(2)
};

var token = function() {
    console.log(rand() + rand()+ rand())
};

token();