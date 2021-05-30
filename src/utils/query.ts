export const generateQuery = (data: any) => {
  return `PREFIX dbpediaOnto: <http://dbpedia.org/ontology/>
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/ontology/>
  PREFIX dbt: <http://dbpedia.org/ontology/>
  SELECT DISTINCT ?x, ?label, ?abstract, ?thumbnail, ?runtime, ?producer, ?producer_name, ?writer
  WHERE {
    {
      ?x rdf:type dbpediaOnto:Film.
      ?x rdfs:label ?label.
      ?x dbo:abstract ?abstract;
          dbo:thumbnail ?thumbnail;
          dbo:runtime ?runtime;
          dbo:producer ?producer;
          dbp:writer ?writer;
          dbp:releaseDate ?releaseDate.
      ?producer rdfs:label ?producer_name.
    }
  
    UNION
    {
      ?x rdf:type dbpediaOnto:Movie.
      ?x rdfs:label ?label.
      ?x dbo:abstract ?abstract;
          dbo:thumbnail ?thumbnail;
          dbo:runtime ?runtime;
          dbo:producer ?producer;
          dbp:writer ?writer;
          dbp:releaseDate ?releaseDate.
      ?producer rdfs:label ?producer_name.
    }
    FILTER( REGEX(STR(?label),"${data.keywords || ""}") )
    FILTER(LANGMATCHES(LANG(?label), "en"))
    FILTER(LANGMATCHES(LANG(?producer_name), "en"))
    FILTER(LANGMATCHES(LANG(?abstract), "en"))
  }
  ORDER BY ${data.sort_direction || "ASC"} (?${data.sort_by || 'label'})
  LIMIT ${data.limit || 25}
  OFFSET ${data.offset || 0}`
}

export const generateKeywordsQuery = (keywords: string, offset?: any) => {
  return `PREFIX dbpediaOnto: <http://dbpedia.org/ontology/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/ontology/>
    PREFIX dbt: <http://dbpedia.org/ontology/>
    SELECT DISTINCT ?label, ?abstract, ?thumbnail, ?runtime, ?producer, ?producer_name, ?writer
    WHERE {
      {
        ?x rdf:type dbpediaOnto:Film.
        ?x rdfs:label ?label.
        ?x dbo:abstract ?abstract;
            dbo:thumbnail ?thumbnail;
            dbo:runtime ?runtime;
            dbo:producer ?producer;
            dbp:writer ?writer.
        ?producer rdfs:label ?producer_name.
      }

      UNION
      {
        ?x rdf:type dbpediaOnto:Movie.
        ?x rdfs:label ?label.
        ?x dbo:abstract ?abstract;
            dbo:thumbnail ?thumbnail;
            dbo:runtime ?runtime;
            dbo:producer ?producer;
            dbp:writer ?writer.
        ?producer rdfs:label ?producer_name.
      }
      FILTER( REGEX(STR(?label),"${keywords}") )
      FILTER(LANGMATCHES(LANG(?label), "en"))
      FILTER(LANGMATCHES(LANG(?producer_name), "en"))
      FILTER(LANGMATCHES(LANG(?abstract), "en"))
    }
    LIMIT 25
    OFFSET ${offset || 0}
  `
}