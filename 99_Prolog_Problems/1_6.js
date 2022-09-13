function g(x){
    const f = () => display(h());
    function h(){
        return 7;
    }
    
    return f(a);
}

const l = () => a;

const a = 3;

g(l());