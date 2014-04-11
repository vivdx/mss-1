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
function Entry(sourceURL,format,dataType,license,phenomenon,obsWindow,obsWinTmpStart,obsWinTmpEnd, idTitle, idProject, idInstitute, idAuthor, idAbstract,
		idKeyword, idCitation, varType, comment, parameter, unit){
	this.sourceURL=sourceURL;
	this.IdTitle = idTitle;
    this.IdProject = idProject;
    this.InstituteURL =idInstituteURL;
    this.IdAuthor = idAuthor;
    this.IdAbstract = idAbstract;
    this.IdKeyword = idKeyword;
    this.IdCitation = idCitation;
    this.varType = varType;
	this.format=format;
	this.comment=comment;
	
    this.IdParameter=parameter;
    this.IdUnit=unit;
	
	this.dataType=dataType;
	this.license=license;
	this.phenomenon=phenomenon;
	this.obsWindowWKT=obsWindow;
	this.obsWindowTempStart=obsWinTmpStart;
	this.obsWindowTempEnd=obsWinTmpEnd;
	
}
