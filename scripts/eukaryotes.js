// Querying NCBI database for genome
d3.select('#domain').on("click", function() {
    d3.xhr("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&retmode=json&term=Plasmodium%20falciparum%20AND%20(%22latest%20refseq%22[filter])%20AND%20%22chromosome%20level%22[filter]",
    function(data) {
        var res = JSON.parse(data.response);
        d3.select('#firstresult').html(data.response);
        console.log("DATA RESPONSE ID LIST: ", res.esearchresult.idlist);
    });
});


// Getting best genome for organism
// Using idlist from first response as query in second response
// Hardcoded URL for now, will fix later
// d3.select('#seconddomain').on("click", function() {
//   d3.xhr("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=360518",
//   function(data) {
//     var res = JSON.parse(data.response);
//     d3.select('#secondresult').html(res.result);
//     console.log("DATA RESPONSE ID LIST PART 2: ", res["result"]["360518"]["assemblyaccession"]);
//     var assemblyaccession = res["result"]["360518"]["assemblyaccession"];
//   });
// });

// Getting best genome for organism
// CORS workaround. Parses for rsuid in ID instead of assemblyaccession
// Using idlist from first response as query in second response
// Hardcoded URL for now, will fix later
d3.select('#seconddomain').on("click", function() {
  d3.xhr("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=360518",
  function(data) {
    var res = JSON.parse(data.response);
    d3.select('#secondresult').html(res.result);
    console.log("DATA RESPONSE ID LIST PART 2: ", res["result"]["360518"]["assemblyaccession"]);
    var rsuid = res["result"]["360518"]["rsuid"];
  });
});


// // Getting chromosome for genome
//
// // FTP not working, try and find a fix for this (lol) later
// d3.select('#thirddomain').on("click", function() {
//   d3.xhr("ftp://ftp.ncbi.nlm.nih.gov/genomes/ASSEMBLY_REPORTS/All/GCF_000002765.3.assembly.txt",
//   function(data) {
//     d3.select('#thirdresult').html(data);
//     console.log("DATA RESPONSE ID LIST PART 3: ", data);
//   });
// });

// Getting chromosome for genome
// CORS workaround
// Instead of grabbing from well known databases like Assembly,
// grab from GenColl. Doesn't check for header access origins
// Fix hardcoded URL on later iteration
d3.select('#thirddomain').on("click", function() {
  d3.xhr("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=json&db=nuccore&linkname=gencoll_nuccore_chr&from_uid=360518",
  function(data) {
    d3.select('#thirdresult').html(data);
    console.log("DATA RESPONSE ID LIST PART 3: ", data);
  });
});
