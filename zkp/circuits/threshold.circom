pragma circom 2.0.0;

include "..\node_modules\circomlib\circuits\comparators.circom";

template threshold () {
    signal input  netWorth;
    signal input threshold;
    signal output result;

    component compare = GreaterEqThan(250);

    compare.in[0] <== netWorth;
    compare.in[1] <== threshold;
    compare.out ==> result;
}

component main = threshold();
