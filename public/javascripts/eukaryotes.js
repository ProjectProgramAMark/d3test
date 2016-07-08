function getChromosomes(organismName) {
    var output = [];
    console.log("organismName is: ", organismName);
    var organism = organismName.split(" ");
    console.log("organism array is: ", organism);
    // Querying NCBI database for genome
    var link = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&retmode=json&term=";
    for (var i = 0; i < organism.length; i++) {
        link += organism[i];
        link += "%20";
    }
    link += "AND%20(%22latest%20refseq%22[filter])%20AND%20%22chromosome%20level%22[filter]";
    d3.xhr(link, function(data) {
        var res = JSON.parse(data.response);
        var idList = res.esearchresult.idlist;
        console.log("DATA RESPONSE ID LIST: ", res.esearchresult.idlist);
        console.log("id list is: ", idList);
        link = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=";
        link += idList[0];
        d3.xhr(link, function(data) {
            var res = JSON.parse(data.response);
            console.log("DATA RESPONSE ID LIST PART 2: ", res["result"][idList[0]]["assemblyaccession"]);
            var rsuid = res["result"][idList[0]]["rsuid"];
            // Getting chromosome for genome
            // CORS workaround
            // Instead of grabbing from well known databases like Assembly,
            // grab from GenColl. Doesn't check for header access origins
            // Fix hardcoded URL on later iteration
            var link = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=json&db=nuccore&linkname=gencoll_nuccore_chr&from_uid=";
            link += rsuid;
            d3.xhr(link, function(data) {
                    var res = JSON.parse(data.response);
                    console.log("LINKS IS: ", res.linksets[0].linksetdbs[0].links);
                    var linksArray = res.linksets[0].linksetdbs[0].links;
                    var links = "";
                    for (var i = 0; i < linksArray.length; i++) {
                        links += linksArray[i].toString();
                        if (i < (linksArray.length - 1)) {
                            links += ",";
                        }
                    }
                    var link = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?retmode=json&db=nucleotide&id=" + links;
                    d3.xhr(link, function(data) {
                        var res = JSON.parse(data.response);
                        var chromosomes = (res.result);
                        console.log("Done with JSON format");
                        var len = Object.keys(chromosomes).length;
                        console.log(chromosomes);
                        for (var x in chromosomes) {
                            // omitting uids
                            if (x == "uids") {
                                continue;
                            }
                            var chromosomeName = chromosomes[x].subname;
                            // console.log("type of name: ", typeof(chromosomeName));
                            console.log("name: ", chromosomes[x].subname);
                            var chromosomeLength = (chromosomes[x].slen).toString();
                            // console.log("type of length: ", typeof(chromosomeLength));
                            console.log("length: ", chromosomes[x].slen);
                            var obj = {
                                "name": chromosomeName,
                                "length": chromosomeLength
                            };
                            output.push(obj);
                        }
                        for (var i = 0; i < output.length; i++) {
                            console.log("output: ", output[i]);
                        }
                    });
                });
        });
    });
    /*
    // Getting chromosome for genome
    // FTP not working, try and find a fix for this (lol) later
      d3.xhr("ftp://ftp.ncbi.nlm.nih.gov/genomes/ASSEMBLY_REPORTS/All/GCF_000002765.3.assembly.txt",
      function(data) {
        d3.select('#thirdresult').html(data);
        console.log("DATA RESPONSE ID LIST PART 3: ", data);
      }); */
}
