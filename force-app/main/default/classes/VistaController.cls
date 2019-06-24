public with sharing class VistaController {
    private final static Integer MAX_RESULTS = 5;

    @AuraEnabled(Cacheable=true)
    public static List<Visita__c> getAllVisita(){
    return [SELECT Id, Name, Apellidos__c, Descripcion__c, Email_Visita__c, Fecha_Visita__c,CI__c, 
            Hora_Entrada__c, Hora_Salida__c, Raza__c,Telefono__c,idIdentificacion__r.Name,
            (select idResponsable__r.Name from Rel_Visita_Responsables__r) FROM Visita__c ];  
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
            Hora_Entrada__c, Hora_Salida__c, Raza__c,Telefono__c, idIdentificacion__r.Name,
            (select idResponsable__r.Name from Rel_Visita_Responsables__r) 
            FROM Visita__c  WHERE Name LIKE :searchTerm ORDER BY Name LIMIT 50];  
    }

    @AuraEnabled
    public static void crearVisita(Visita__c visita, List<String> responsables){      
        List<Rel_Visita_Responsable__c> listRel = new List<Rel_Visita_Responsable__c>();
        upsert visita;  
        List<Rel_Visita_Responsable__c> listRelDel = [SELECT id FROM Rel_Visita_Responsable__c WHERE idVisita__c =: visita.Id];
        delete listRelDel;
        for (String  idResp: responsables) {
            Rel_Visita_Responsable__c relNew = new Rel_Visita_Responsable__c(idResponsable__c=idResp , idVisita__c=visita.Id);
            listRel.add(relNew);
        } 
        insert listRel;    
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

    @AuraEnabled
    public static void deleteVisita(String idVisita){
        Visita__c visitaDel = [Select Name from Visita__c where id =: idVisita];
        delete visitaDel;
    }

    @AuraEnabled
    public static Visita__c getVisitById(String idVisita){
        return [SELECT Id, Name, Apellidos__c, Descripcion__c, Email_Visita__c, Fecha_Visita__c,CI__c, 
            Hora_Entrada__c, Hora_Salida__c, Raza__c,Telefono__c, idIdentificacion__r.Name,Sexo__c,tipoId__c,
            (select idResponsable__r.Name from Rel_Visita_Responsables__r),Pertenecias__c,Primera_Impresion__c
            FROM Visita__c  WHERE Id =: idVisita  LIMIT 1];  
    }

    
}
