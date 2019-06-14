public with sharing class VistaController {
    private final static Integer MAX_RESULTS = 5;

    public VistaController() {

    }

    @AuraEnabled(Cacheable=true)
    public static List<Visita__c> getAllVisita(){
    return [SELECT Id, Name, Apellidos__c, Descripcion__c, Email_Visita__c, Fecha_Visita__c,CI__c, 
            Hora_Entrada__c, Hora_Salida__c, Raza__c,Telefono__c
            FROM Visita__c ];  
    }   

    @AuraEnabled(Cacheable=true)
    public static List<Visita__c> buscarVisita(String searchTerm){
      // Return all bears when no search term
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getAllVisita();
        }
        // Prepare query paramters
        searchTerm = '%'+ searchTerm +'%';
        // Execute search query
        return [SELECT Id, Name, Apellidos__c, Descripcion__c, Email_Visita__c, Fecha_Visita__c,CI__c, 
            Hora_Entrada__c, Hora_Salida__c, Raza__c,Telefono__c FROM Visita__c  WHERE Name LIKE :searchTerm ORDER BY Name LIMIT 50];  
    }

    @AuraEnabled
    public static void crearVisita(Visita__c visita){
        //system.debug()
        insert visita;        
    }

    @AuraEnabled
    public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds, String objectName, String fld_API_Text, String fld_API_Val, String icon) {
        System.debug('entro');
        searchTerm='\'%' + String.escapeSingleQuotes(searchTerm.trim()) + '%\'';


         // Execute search query   
        String query = 'SELECT ' + fld_API_Text + ' ,' + fld_API_Val +
            			' FROM ' + objectName +
            			' WHERE NAME LIKE '+ searchTerm + 
                        ' AND ' + 'ID NOT IN :selectedIds' +
            			' LIMIT ' + MAX_RESULTS;
        
        List<sObject> sobjList = Database.query(query); 
         // Prepare query paramters
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        // Extract Accounts & convert them into LookupSearchResult     
        for(SObject s : sobjList){
            results.add(new LookupSearchResult(String.valueOf(s.get(fld_API_Val)), objectName , icon, String.valueOf(s.get(fld_API_Text))));   
            
        }        
        return results;
        
    }

    
}
