process_query(`assert(
rule(same($x, $x)))`);

process_query(`assert(
rule(member($x, pair($x, $v), pair($x, $v)))		     
)`);

process_query(`assert(
rule(member($x, null, null))
)`);

process_query(`assert(
rule(member($x, pair($y, $rest_y), $zs), member($x, $rest_y, $zs))
		     )`);

// TESTING
     
first_answer(`member("a", list("a", "b", "c", "d"), $zs)`); // output "member(\"a\", list(\"a\", \"b\", \"c\", \"d\"), null)"
// first_answer(`member("c", list("a", "b", "c", "d"), $zs)`);
// first_answer(`member("e", list("a", "b", "c", "d"), $zs)`);
// first_answer(`member($x, list("a", "b", "c", "d"), 
//                         list("a", "b", "c", "d"))`);
// first_answer(`member($x, list("a", "b", "c", "d"), 
//                         list("c", "d"))`);


// and(member($x, $rest_y, $zs), not(same($x, $y)))