WebCGF-SWI Prolog integration
=============================

This example shows how to create a simple HTTP server in SWI Prolog that serves static files on a specific folder, and answers a specific query with prolog terms.

After decompressing, open http2.pl in SWI (the server will run automatically on port 8081), and use your browser to access:

http://localhost:8081/pub/prob1/switest.html - A simple form that queries prolog and shows the result

http://localhost:8081/pub/prob1/index.html - The entry page of a sample WebCGf project

Check the code in "http2.pl" and "pub/prob1/switest.html" to see how it is done, and to adjust configurations.

Credits: Daniel Silva <dcs@fe.up.pt>, Rui Rodrigues <rui.rodrigues@fe.up.pt>
