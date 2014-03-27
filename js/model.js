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
function Entry(sourceURL,format,dataType,license,phenomenon,obsWindow,obsWinTmpStart,obsWinTmpEnd){
	this.sourceURL=sourceURL;
	this.IdTitle = IdTitle;
    this.IdProject = IdProject;
    this.IdInstitute = IdInstitute;
    this.IdAuthor = IdAuthor;
    this.IdAbstract = IdAbstract;
    this.IdKeyword = IdKeyword;
    this.IdCitation = IdCitation;
    this.varType = varType;
	this.format=format;
	
//	this.IdParameter=IdParameter;
    this.IdParameter=AllParameter;
//	this.IdUnit=IdUnit;
    this.IdUnit=AllUnit;
	
	this.dataType=dataType;
	this.license=license;
	this.phenomenon=phenomenon;
	this.obsWindowWKT=obsWindow;
	this.obsWindowTempStart=obsWinTmpStart;
	this.obsWindowTempEnd=obsWinTmpEnd;
	
}
