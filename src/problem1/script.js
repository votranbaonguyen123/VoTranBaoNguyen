var sum_to_n_a = function(n) {
    let sum = 0
    for (let i = 1; i <= n; i++) {
        sum += i
    }
    return sum
};

var sum_to_n_b = function(n) {
    if(n === 1){
        return n
    }
    return n + sum_to_n_b(n - 1)
    
};

var sum_to_n_c = function(n) {
    let sum = 0
    let i = 1
    while(i <= n){
        sum += i
        i++;
    }
    return sum
};

console.log(sum_to_n_c(5))