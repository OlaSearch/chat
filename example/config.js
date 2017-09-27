// import customSnippet from './components/customSnippet';

module.exports = {
    array_separator: null,
    infiniteScroll: true,
    showEmptyFacet: false,
    facetSearchLimit: 5,
    searchTimeOut: 100,
    autoSuggestTimeout: 100,
    mediaQuery: {
        mobile: 'screen and (max-width: 600px)',
        tablet: 'screen and (min-width: 768px)',
        desktop: 'screen and (min-width: 960px)'
    },
    ajaxOptions: {
        method: 'POST',
        type: 'json',
        crossOrigin: true,
        // withCredentials: true,
        headers: {
            // "Authorization": "Basic " + btoa( 'user' + ':' + 'pass' )
        }
    },
    search_engine_type: 'solr',
    searchHistory: false,
    bookmarking: true,
    intentEngineEnabled: true,
    searchPageUrl: '/',
    history: 'pushState',
    proxy: true,
    projectId: "59116d96300397120cfecdc0",
    env: 'staging',
    namespace: "mom",
    chatbotBubbleLabel: 'Ask me about FDW eligiblity (Beta 1.0)',
    api: {
        intent: "https://api.staging.olasearch.com/intent",
        search: "https://api.staging.olasearch.com/search",
        suggest: "https://api.staging.olasearch.com/suggest"
    },
    logger: {
        enabled: false,
        engine:["logstash", "google"],
        url:"https://api.staging.olasearch.com/log",
        headers:{},
        fields:{
            title:"title_t",
            url:"url_s"
        },
        params:{bot: true}
    },
    // defaultSnippet: customSnippet,
    mapping: [
        {
            name: 'q',
            key: 'q',
            value: '',
            default_field: 'title_t',
            multi_match_fields: ['title_t', 'content_t', 'excerpt_t', 'ola_bb_queries^9000'],
            suggest_fields: 'spell_field'
        },
        {
            name: 'page',
            key: 'start',
            value: 1
        },
        {
            name: 'per_page',
            key: 'rows',
            value: 10,
            hidden: true
        },
        {
            name: 'facet_field',
            key: 'facet.field',
            value: [],
            hidden: true,
        },
        {
            name: 'facet_query',
            key: 'fq',
            value: []
        },
        {
            name: 'field_query',
            key: 'fl',
            value : '',
            hidden: true
        },
        {
            name: 'facet_limit',
            key: 'facet.limit',
            value: 500,
            hidden: true,
        },
        {
            name: 'spellcheck_collate',
            key: 'spellcheck.collate',
            value: true,
            hidden: true
        },
        {
            name: 'output',
            key: 'wt',
            value: 'json',
            hidden: true
        },
        {
            name: 'facet',
            key: 'facet',
            value: true,
            hidden: true
        },
        {
            name: 'sort',
            key: 'sort',
            value: '',
        },
        {
            name: 'highlight_fields',
            key: 'highlight_fields',
            value:  ["title_t"],
            pre_tags: ['<em class="ola-highlight">'],
            post_tags: ['</em>'],
            size: 200
        }
    ],
    mappingAutoSuggest: [
        {
            name: 'q',
            key: 'q',
            value: ''
        },
        {
            name: 'page',
            key: 'start',
            value: 1
        },
        {
            name: 'per_page',
            key: 'rows',
            value: 10,
            hidden: true
        },
        {
            name: 'field_query',
            key: 'fl',
            value: []
        },
        {
            name: 'highlight_fields',
            key: 'highlight_fields',
            value:  ["title_t"],
            pre_tags: ['<em class="ola-highlight">'],
            post_tags: ['</em>'],
            size: 200
        }
    ],
    fieldMappings: {
        id        : 'id',
        title     : 'title_t',
        summary   : 'synopsis_t',
        url       : 'link_s',
        year: 'year_i',
        genres: 'genres_sm',
        rating: 'mpaa_rating_s',
        runtime: 'runtime_i',
        release_date: 'release_date_theatre_tdt',
        critics_rating: 'critics_rating_s',
        critics_score: 'critics_score_i',
        audience_rating: 'audience_rating_s',
        audience_score: 'audience_score_i',
        star_rating: 'audience_score_i',
        poster: 'poster_s',
        thumbnail: 'thumbnail_s',
        thumbnail_mobile: 'thumbnail_mobile_s',
        cast: 'cast_tm',
        directors: 'directors_tm',
        studio: 'studio_s',
    },
    facetsToDisplay: {
        '*' : ["award_type_s","award_location_s","award_date_i","sector_s","company_size_s"],"award-winners":["ola_collection_name","award_type_s","award_location_s","award_date_i","sector_s","company_size_s"]
    },
    nullFacetName: 'Uncategorised',
    facets:[{displayName:"Company SIze",name:"company_size_s",type:"checkbox",facetNames:{},isRoot:!1,multiSelect:!0,_id:"58a419ba3e0d0519112cef68",isGlobal:!0,order:5,isCollapsed:!1},{displayName:"Sector",name:"sector_s",type:"string",facetNames:{},isRoot:!1,multiSelect:!1,_id:"58a419963e0d0519112cef5f",isGlobal:!0,order:4,showSelectedTag:!1,isCollapsed:!1},{displayName:"Year",name:"award_date_i",type:"string",facetNames:{},isRoot:!1,multiSelect:!1,_id:"58a419803e0d0519112cef56",isGlobal:!0,order:3,showSelectedTag:!1,isCollapsed:!1},{displayName:"Country",name:"award_location_s",type:"string",facetNames:{},isRoot:!1,multiSelect:!1,_id:"58a4196d3e0d0519112cef4d",isGlobal:!0,order:2,showSelectedTag:!1,isCollapsed:!1},{displayName:"Award type",name:"award_type_s",type:"string",facetNames:{},isRoot:!1,multiSelect:!1,_id:"58a289e93e0d0519112cec90",isGlobal:!0,order:1,showSelectedTag:!1,isCollapsed:!1},{displayName:"Collection",name:"ola_collection_name",type:"string",facetNames:{"award-winners":"Award winners"},isRoot:!0,multiSelect:!1,_id:"58a287f83e0d0519112ceba0",isGlobal:!0,order:0,showSelectedTag:!1,isCollapsed:!1,resetOnDeSelect:!0}],
    sortBy: [
        {
            name: 'Title A-Z',
            value: 'title_s asc'
        },
        {
            name: 'Title Z-A',
            value: 'title_s desc'
        },
        {
            name: 'Latest first',
            value: 'year_i desc'
        },
        {
            name: 'Oldest first',
            value: 'year_i asc'
        },
        {
            name: 'Rating high-low',
            value: 'audience_score_i desc'
        }
    ],
    perPage: ['10', '20', '50', '100'],
    filters: []
}