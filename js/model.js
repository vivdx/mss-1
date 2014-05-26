/**
 * Create an instance of an entry which represents an entry in the statitics portal
 *
 * @constructor
 * @this {Entry}
 * @param  {string} sourceURL
 * @param  {string} dataType
 * @param  {string} license
 * @param  {string} phenomenon
 * @param  {bbox} obsWindow
 */
function Entry(sourceURL,format,dataType,license,phenomenon,obsWindow,obsWinTmpStart,obsWinTmpEnd,
				idTitle, idProject, idInstituteURL, idAuthor, idAbstract,
				idKeyword, idCitation, comment, parameter, unit){
				
	this.sourceURL=sourceURL;
	this.format=format;
	this.dataType=dataType;
	this.license=license;
	this.phenomenon=phenomenon;
	this.obsWindowWKT=obsWindow;
	this.obsWindowTempStart=obsWinTmpStart;
	this.obsWindowTempEnd=obsWinTmpEnd;
	
	this.idTitle = idTitle;
    this.idProject = idProject;
    this.idInstituteURL =idInstituteURL;
    this.idAuthor = idAuthor;
    this.idAbstract = idAbstract;
    this.idKeyword = idKeyword;
    this.idCitation = idCitation;
  //  this.varType = varType;  is data type
    this.comment=comment; 
    this.idParameter=parameter;
    this.idUnit=unit;

}