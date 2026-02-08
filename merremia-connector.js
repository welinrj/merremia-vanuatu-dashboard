/**
 * Merremia Field Data Connector
 * Fetches field-collected records from the merremia-field-data GitHub repo
 * and provides them to the dashboard for visualisation.
 *
 * Usage:
 *   const connector = new MerremiaConnector('owner', 'merremia-field-data');
 *   const records = await connector.fetchRecords();
 */

class MerremiaConnector {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo || 'merremia-field-data';
    this.token = token || null;
    this.baseUrl = 'https://api.github.com/repos/' + this.owner + '/' + this.repo;
    this.cache = { records: null, timestamp: 0 };
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  headers() {
    var h = { 'Accept': 'application/vnd.github+json' };
    if (this.token) h['Authorization'] = 'Bearer ' + this.token;
    return h;
  }

  async fetchRecords() {
    // Return cached if fresh
    if (this.cache.records && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.records;
    }

    try {
      // Try the aggregated file first (faster)
      var resp = await fetch(this.baseUrl + '/contents/data/all-records.json', {
        headers: this.headers()
      });

      if (resp.ok) {
        var data = await resp.json();
        var content = atob(data.content.replace(/\n/g, ''));
        var records = JSON.parse(content);
        if (Array.isArray(records) && records.length > 0) {
          this.cache = { records: records, timestamp: Date.now() };
          return records;
        }
      }

      // Fallback: fetch individual record files
      var listResp = await fetch(this.baseUrl + '/contents/records', {
        headers: this.headers()
      });

      if (!listResp.ok) return [];

      var files = await listResp.json();
      var jsonFiles = files.filter(function(f) { return f.name.endsWith('.json') && f.name !== '.gitkeep'; });

      var records = [];
      for (var i = 0; i < jsonFiles.length; i++) {
        try {
          var fileResp = await fetch(jsonFiles[i].download_url, { headers: this.headers() });
          if (fileResp.ok) {
            var record = await fileResp.json();
            records.push(record);
          }
        } catch(e) { /* skip failed files */ }
      }

      this.cache = { records: records, timestamp: Date.now() };
      return records;
    } catch(err) {
      console.error('MerremiaConnector: fetch error', err);
      return this.cache.records || [];
    }
  }

  // Aggregate records into summary stats
  summarize(records) {
    if (!records || records.length === 0) return null;

    var byIsland = {};
    var bySpecies = {};
    var byThreat = { High: 0, Moderate: 0, Low: 0 };
    var totalArea = 0;
    var totalCount = 0;

    records.forEach(function(r) {
      // By island
      if (!byIsland[r.island]) byIsland[r.island] = { count: 0, area: 0, records: 0 };
      byIsland[r.island].count += (r.count || 1);
      byIsland[r.island].area += (r.coverageArea || 0);
      byIsland[r.island].records++;

      // By species
      if (!bySpecies[r.species]) bySpecies[r.species] = { count: 0, threat: r.threatLevel };
      bySpecies[r.species].count += (r.count || 1);

      // By threat
      if (r.threatLevel && byThreat.hasOwnProperty(r.threatLevel)) {
        byThreat[r.threatLevel]++;
      }

      totalArea += (r.coverageArea || 0);
      totalCount += (r.count || 1);
    });

    return {
      totalRecords: records.length,
      totalObservations: totalCount,
      totalArea: Math.round(totalArea * 10) / 10,
      byIsland: byIsland,
      bySpecies: bySpecies,
      byThreat: byThreat,
      latestRecord: records.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      })[0]
    };
  }

  // Get all unique coordinates for mapping
  getMapPoints(records) {
    return records.filter(function(r) { return r.latitude && r.longitude; }).map(function(r) {
      return {
        lat: r.latitude,
        lng: r.longitude,
        species: r.species,
        threat: r.threatLevel,
        island: r.island,
        site: r.siteName,
        count: r.count || 1,
        date: r.timestamp,
        observer: r.observer
      };
    });
  }
}

// Export for use in browser and Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MerremiaConnector;
}
